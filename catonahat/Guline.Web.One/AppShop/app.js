function convertfromMSDate(dateStr) {
    var m, day;
    jsonDate = dateStr;
    var d = new Date(parseInt(jsonDate.substr(6)));
    m = d.getMonth() + 1;
    if (m < 10)
        m = '0' + m
    if (d.getDate() < 10)
        day = '0' + d.getDate()
    else
        day = d.getDate();
    return (day + '/' + m + '/' + d.getFullYear())
}
var decodeHtml = (function () {
    // Remove HTML Entities                                                             
    var element = document.createElement('div');

    function decode_HTML_entities(str) {

        if (str == null) {
            return "";
        }
        if (str && typeof str === 'string') {

            // Escape HTML before decoding for HTML Entities
            str = escape(str).replace(/%26/g, '&').replace(/%23/g, '#').replace(/%3B/g, ';');

            element.innerHTML = str;
            if (element.innerText) {
                str = element.innerText;
                element.innerText = '';
            } else {
                // Firefox support
                str = element.textContent;
                element.textContent = '';
            }
        }

        return unescape(str);
    }
    return decode_HTML_entities;
})();
function url_friendly(alias) {
    if (alias == null || alias == "")
        return "";
    if (alias.length == 0)
        return "";
    var str = alias;
    str = str.toLowerCase();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'| |\"|\&|\#|\[|\]|~|$|_/g, "-");
    /* tìm và thay thế các kí tự đặc biệt trong chuỗi sang kí tự - */
    str = str.replace(/-+-/g, "-"); //thay thế 2- thành 1-
    str = str.replace(/^\-+|\-+$/g, "");
    //cắt bỏ ký tự - ở đầu và cuối chuỗi 

    str = str.replace(/\s+/g, '-').toLowerCase();
    return str;
}

app = angular.module('gulineWebApp', ['ezfb', 'angular-flash.service', 'angular-flash.flash-alert-directive', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate', 'ncy-angular-breadcrumb', 'chieffancypants.loadingBar', 'ngAnimate', 'ngCookies']);
app.config(['$translateProvider', 'cfpLoadingBarProvider', "$sceProvider", '$locationProvider', 'ezfbProvider', function ($translateProvider, cfpLoadingBarProvider, $sceProvider, $locationProvider, ezfbProvider) {
    //cfpLoadingBarProvider.includeSpinner = false;
    $translateProvider.useStaticFilesLoader({
        prefix: _gconfig.appPath + '/langs/',
        suffix: '.txt'
    });
    $translateProvider.preferredLanguage('vi-vn');
    $sceProvider.enabled(false);

    $locationProvider.html5Mode(true);
    ezfbProvider.setInitParams({
        appId: '269534733223147'
    });
}]);
app.factory('broadcastService', function ($rootScope) {

    var broadcastService = {};

    broadcastService.data = {};

    broadcastService.prepForBroadcast = function (data) {
        this.data = data;
        this.broadcastItem();
    };

    broadcastService.broadcastItem = function () {
        $rootScope.$broadcast('handleBroadcast');
    };

    return broadcastService;
});

app.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        //$rootScope.msdate = convertfromMSDate;


    }
])
.config(['flashProvider', function (flashProvider) {

    flashProvider.errorClassnames.push('alert-danger');
    flashProvider.warnClassnames.push('alert-warning');
    flashProvider.infoClassnames.push('alert-info');
    flashProvider.successClassnames.push('alert-success');

}])
.config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('main', {
            ncyBreadcrumb: {
                label: 'SHOP'
            },
            views: {
                "gMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gMain.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                     }]
                }//end vMain
            }
        })
        .state('main.home', {
            ncyBreadcrumb: {
                label: 'Trang chủ', parent: null
            },
            resolve: {
                appconfig: ['$http', function ($http) {
                    return $http({ method: 'GET', url: 'api/Object/getAppConfig' })
                      .then(function (res) {
                          var h = new Object();
                          var attrs = res.data.config.Attrs;
                          attrs.forEach(function (element, index, array) {
                              h[element.AttrName] = element.AttrValue;
                          });
                          console.log(res);
                          return { config: h, menus: res.data.menus, province: res.data.ProvinceList, ShoppingCart: res.data.ShoppingCart, User: res.data.User };
                      });
                }]
            },
            views: {
                "vTop": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/vTop.html"
                   , controller: ['$scope', '$state', '$http', 'appconfig',
                     function ($scope, $state, $http, appconfig) {
                         //$scope.menu = appconfig.menus[0].Childrens;
                         $scope.appconfig = appconfig.config;
                         $scope.cart = appconfig.ShoppingCart;
                         $scope.user = appconfig.User;
                         $scope.logout=function()
                         {
                             $http({
                                 method: "post",
                                 url: '/api/User/Logout',
                                 data: null,
                             }).success(function (data, status, headers, config) {
                                 window.location.href='/';
                                 // this callback will be called asynchronously
                                 // when the response is available
                             }).
                            error(function (data, status, headers, config) {
                                // called asynchronously if an error occurs
                                // or server returns response with an error status.
                            });
                         }
                     }]

                },
                "vNav": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gNav.html"
                  , controller: ['$scope', '$state', '$http', 'appconfig','$rootScope',
                    function ($scope, $state, $http, appconfig, $rootScope) {
                        $scope.appconfig = appconfig.config;
                        $scope.menu = appconfig.menus.Items;
                        var defaultText = "<strong class='nav-text'> ALL ITEMS </strong>";
                        $scope.defaultText = defaultText;
                        $scope.cat_text = defaultText;
                        var isSubPage = false;
                        $scope.showtext = function (value, name) {
                            $("." + name).addClass('hover');
                            if (isSubPage) return;
                            $scope.cat_text = "<strong class='nav-text'>" + value + "</strong>";
                        }
                        $scope.showitem = function (value, name,id) {
                            $scope.defaultText = value;
                            $('.active').removeClass('active');
                            $("." + name).addClass('active');
                           if (isSubPage) return;
                   
                           $scope.cat_text = "<strong class='nav-text'>" + value + "</strong>";
                           $rootScope.$broadcast("change_Menu", [id]);

                        }
                        $scope.defauttext = function (value) {
                            $("." + value).removeClass('hover');
                            if (isSubPage) return;
                            
                            $scope.cat_text = "<strong class='nav-text'>"+$scope.defaultText+" </strong>";
                        }
                        $scope.$on("change_nav", function (e, args) {
                            $scope.defaultText = args[1]
                            $scope.cat_text = args[1];
                            if (args[0] == false) {
                                isSubPage = true;
                            }
                        });
                    }]
                },
                "vBottom": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gBottom.html"
                   , controller: ['$scope', '$state', '$http', 'appconfig',
                     function ($scope, $state, $http, appconfig) {
                         $scope.appconfig = appconfig.config;

                     }]
                },
                "vContent": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/home/index.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                         $scope.goto = function (to) {
                             window.location.href = to;
                         }
                     }]
                }
            }
        }).state('main.home.index', {
            url: "{t:[/*]}",
            ncyBreadcrumb: {
                label: 'Home Page', parent: null
            },
            data: { title: "Trang chủ" },
            views: {
                "homeMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/home/home.html"
                   , controller: ['$scope', "$rootScope", '$state', '$http', 'appconfig',
                     function ($scope, $rootScope, $state, $http, appconfig) {
                         $rootScope.$broadcast("change_nav", [true, "<strong class='nav-text'> ALL ITEMS </strong>"]);
                         $scope.appconfig = appconfig.config;
                         $scope.$on("change_Menu", function (e, args) {
                             if (args[0])
                             {
                                 GetCatData(args[0]);
                             }
                             else
                             {
                                 getData();
                             }
                          
                            
                         });
            
                         getData();
                         function GetCatData(value)
                         {
                             $http.get(_gconfig.baseWebUrl + '/api/Object/GetListNoPageChildObjectData?objectname=Product&parentid=' + value).
                                                           success(function (res, status, headers, config) {
                                                               if (res.success) {
                                                                   $scope.product = res.data;
                                                                   console.log($scope.product);
                                                               }
                                                               else {
                                                                   $scope.msg = response.msg;
                                                               }

                                                           });
                         }
                         function getData(value) {
                             $http.get(_gconfig.baseWebUrl + '/api/Object/GetListNoPageChildObjectData?objectname=Product').
                               success(function (res, status, headers, config) {
                                       if (res.success) {
                                           $scope.product = res.data;
                                           console.log($scope.product);
                                       }
                                       else {
                                           $scope.msg = response.msg;
                                       }

                               });
                         }//end getdata()
                     }]
                }
            }
        })
        .state('main.home.product', {
            url: "/:catName/:productID-:id",
            ncyBreadcrumb: {
                label: 'ProductPage', parent: null
            },
            data: { title: "Product" },
            views: {
                "homeMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/product/product.html"
                   , controller: ['$scope', "$rootScope", '$state', '$http', 'appconfig', "flash",
                     function ($scope, $rootScope, $state, $http, appconfig, flash) {
                         $scope.CatName = $state.params.catName;
                         $scope.appconfig = appconfig.config;
                         $rootScope.$broadcast("change_nav", [true, "<strong class='nav-text'>" + $scope.CatName + " </strong>"]);
                         $scope.loadsize=function(value)
                         {
                             var size = $scope.obj.Attrs[2].CustomObjectsValue.filter(function (f) { return f != null && f.Color == value });
                             if (size.length > 0)
                                 {

                                 $scope.selectsize = size[0].Size;
                             }
                             else
                             {
                                 $scope.selectsize = "";
                             }
                             console.log($scope.selectsize);

                         }

                         $scope.addtoCart = function (obj) {
                             $http.post("api/Object/AddCart", obj)
                             .success(function (response) {
                                 $(".cart-count").text(response.count);
                                 if (response.success) {

                                     appconfig.ShoppingCart.List.push({ ID: obj.ID });
                                     appconfig.ShoppingCart.Count = response.Count;
                                     flash.success = "Product add to cart, Success!";
                                    
                                     if (obj) {
                                         obj.inCart = true;
                                     }
                                     // btn.html("<span class='cartlabel'><i class='fa fa-check font-success'></i>&nbsp;giỏ hàng</span>");
                                 }
                                 else {
                                     flash.error=response.msg;
                                     // $(".msgcart").text(response.msg).removeClass("hidden").addClass("alert-danger");
                                 }
                             }).error(function (data, status, headers, config) {
                                 $scope.msg = data;
                                 flash.error="Please input Color,size,Quantity";
                             });
                             //

                         }
                         getData();
                         function getData() {
                             $http.get("api/object/GetObjectContent?ID=" + $state.params.id)
                                .success(function (response) {
                                    console.log(response);
                                    if (response.success) {
                                        
                                        $scope.obj = response.data;
                                        $scope.selectcolor = [];
                              $scope.obj.Attrs[2].CustomObjectsValue.filter(function (f) { return f != null }).forEach(function (f) {
                                  $scope.selectcolor.push(f.Color);
                              });
                              $state.current.data.title = $scope.obj.Title;
                              $("html, body").animate({
                                  scrollTop: $('.breadcrumb').offset().top
                              }, 1000);
                              if (response.data.PageChildrens != null) {
                                  $scope.gupagination = { totalitems: response.data.PageChildrens.TotalItems, itemperpage: response.data.PageChildrens.ItemsPerPage, page: response.data.PageChildrens.CurrentPage, maxsize: 5 };
                              }
                          }
                          else {
                              $scope.msg = response.msg;
                          }
                      }).error(function (data, status, headers, config) {

                          $scope.msg = data;

                      });
                         }//end getdata
                     }]
                }
            }
        })
    .state('main.home.account', {
        url: "/account",
        ncyBreadcrumb: {
            label: 'Account', parent: null
        },
        data: { title: "Account" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/account/youraccount.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout", 'flash',
                 function ($scope, $state, $http, appconfig, $timeout,flash) {
                     $scope.accountactive = false;
                     $scope.infoactive = false;
                     $scope.orderactive = false;
                     $scope.changepass = false;
                     $scope.accountinfo = appconfig.User;
                     $scope.page = 1;
                     $scope.itemperpage = 12;
                     gethistoryorder();
                     function gethistoryorder()
                     {

                         $http({
                             method: "post",
                             url: '/api/Object/GetMyOrders',
                             data: { cpage: $scope.page, cpageitem: $scope.itemperpage },
                         }).success(function (re, status, headers, config) {
                             
                             if (!re.success) {
                                 flash.error=re.msg;
                             }
                             else {
                                 $scope.acountorder = re.data;
                             }
                         });
                     }
                     $scope.acountorder = {
                         Count:0
                     };
                     $scope.saveInfo=function()
                     {
                         data = $scope.accountinfo;
                         $http({
                             method: "post",
                             url: '/api/User/Update',
                             data: data,
                         }).success(function (re, status, headers, config) {
                             if (!re.success) {
                                 if ($scope.accountinfo.Password != null) {
                                     flash.error = re.msg;
                                 }
                                 else {

                                     flash.success = "Updated!";
                                 }
                             }
                             else {
                                 //chuyen ve trang list
                                 flash.success = "Updated!";
                                 $timeout(window.location.reload(), 2000);
                             }
                         });
                     }
                     $scope.activeli=function(value)
                     {
                         if (value == 'account') {
                             $scope.accountactive = true;
                             $scope.infoactive = false;
                             $scope.orderactive = false;
                         }
                         else if (value == 'info')
                         {
                             $scope.accountactive = false;
                             $scope.infoactive = true;
                             $scope.orderactive = false;
                         }
                           
                         else
                         {
                             $scope.accountactive = false;
                             $scope.infoactive = false;
                             $scope.orderactive = true;
                         }
                     }
                     $scope.show = {};
                     $scope.showdetail=function(ID)
                     {
                         if ($scope.show[ID])
                             $scope.show[ID] = false;
                         else
                             $scope.show[ID] = true;
                     }
                 }]
            }
        }

    })
    .state('main.home.about', {
        url: "/about",
        ncyBreadcrumb: {
            label: 'About Us', parent: null
        },
        data: { title: "About Us" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/about/about.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                     init();
                     function init() {
                         $http.get("api/object/GetAboutus")
                   .success(function (response) {
                       $scope.data = response.data;
                   })
                     }
                       
                 }]
            }
        }
    })
    .state('main.home.contact', {
        url: "/contact",
        ncyBreadcrumb: {
            label: 'Contact Us', parent: null
        },
        data: { title: "Contact Us" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/about/about.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                 }]
            }
        }
    })
    .state('main.home.payment', {
        url: "/paymentmethod",
        ncyBreadcrumb: {
            label: 'Payment Method', parent: null
        },
        data: { title: "Payment Method" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/payment/paymentmethod.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                     init();
                     function init() {
                         $http.get("api/object/GetPaymentMethod")
                         .success(function (response) {
                             $scope.data = response.data;
                         })
                     }
                 }]
            }
        }
    })
    .state('main.home.job', {
        url: "/jobs",
        ncyBreadcrumb: {
            label: 'Jobs', parent: null
        },
        data: { title: "Jobs" },
        views: {
            "homeMain": {
                templateUrl: _gconfig.baseAppResouceUrl + "/views/job/job.html"
               , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",
                 function ($scope, $state, $http, appconfig, $timeout) {
                 }]
            }
        }
    })
     .state('main.home.bag', {
         url: "/bag",
         ncyBreadcrumb: {
             label: 'Your Bag', parent: null
         },
         data: { title: "Your Bag" },
         views: {
             "homeMain": {
                 templateUrl: _gconfig.baseAppResouceUrl + "/views/checkout/bag.html"
                , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout", 'flash',
                  function ($scope, $state, $http, appconfig, $timeout, flash) {
                      GetCart();
                      
                      function GetCart()
                      {
                          $http.get("api/object/GetCart")
                            .success(function (response) {

                                if (response.success) {
                                    if (response.user) {
                                        $scope.appconfig.User = response.user;
                                        $scope.People = { gFullName: appconfig.User.gFullName, phone: appconfig.User.Phone, email: appconfig.User.Email, address: appconfig.User.Address };
                                    }
                                    if (response.data.Count <= 0)
                                    {
                                        flash.success="You haven't any item in a Bag, Go to our product in 3s";
                                        $timeout(function () { window.location.href = '/' },3000);
                                       

                                    }
                                    $scope.cart = response.data;
                                    $(".cartcount").text(response.data.Count);

                                      
                                }
                                else {
                                    $scope.msg = response.msg;
                                }
                            }).error(function (data, status, headers, config) {
                                $scope.msg = data;
                            });
                      }
                      $scope.removecart = function (id) {
                          if (confirm("Bạn có muốn xóa nội dung này khỏi giỏ hàng không?")) {
                              $http.get("api/Object/RemoveCart?ID=" + id)
                               .success(function (response) {
                                   if (response.success) {
                                       $("tr[data-cartid='" + id + "']").remove();

                                       //appconfig.ShoppingCart.List.push({ ID: id });    hh - remove from the list in cart javascript
                                       $(".cartcount").text(response.Count);
                                       $scope.cart.TotalAmount = response.TotalAmount;
                                       console.log(response)
                                       var mobj = appconfig.ShoppingCart.List.filter(function (f) {
                                           return f.ID == id;
                                       });

                                       if (mobj != null && mobj.length > 0) {
                                           var index = appconfig.ShoppingCart.List.indexOf(mobj[0]);
                                           appconfig.ShoppingCart.List.splice(index, 1);
                                           $scope.cart.List.splice(index, 1);
                                           //delete mobj;
                                       }

                                       $scope.cart.Count = response.Count;
                                   }
                                   else {
                                       $scope.msg = response.msg;
                                   }
                               }).error(function (data, status, headers, config) {
                                   $scope.msg = data;
                               });
                          }
                      }
                      $scope.updateCart = function () {
                          for (var i = 0; i < $scope.cart.List.length; i++)
                          {
                              var item = $scope.cart.List[i];
                              if (!item.Quantity) {
                                  item.Quantity = 1;
                              }
                              $http.post("api/object/UpdateCart", { ID: item.ID, Quantity: item.Quantity, price: item.Price })
                                .success(function (response) {
                                    if (response.success) {
                                        $scope.cart = response.data;
                                        appconfig.ShoppingCart = response.data;
                                    }
                                    else {
                                        $scope.msg = response.msg;
                                        $scope.running = false;

                                    }

                                }).error(function (data, status, headers, config) {
                                    $scope.msg = data;
                                });
                          }
                      }
                   
                  }]
             }
         }
     })
           .state('main.home.checkout', {
               url: "/checkout",
               ncyBreadcrumb: {
                   label: 'Checkout Page', parent: null
               },
               data: { title: "Checkout" },
               views: {
                   "homeMain": {
                       templateUrl: _gconfig.baseAppResouceUrl + "/views/checkout/checkout.html"
                      , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout", 'flash',
                        function ($scope, $state, $http, appconfig, $timeout, flash) {
                            $scope.currentUser = appconfig.User;
                            $scope.shippingTransfer = "Bank Transfer";
                            $scope.provincelist = appconfig.province;
                            $scope.selectedProvince = {};
                            $scope.userlogin = {
                                username: "",
                                password:""
                            }
                            $scope.userRegister = {
                                FullName: "",
                                Password:"",
                                Gender: "Nam",
                                Email: "",
                                Phone: "",
                                Address: "",
                                Province: "",
                                District:""
                            }
                            $scope.loaddistrict = function (selectedProvince)
                            {
                                $scope.selectedProvince = selectedProvince;
                                getDistrict(selectedProvince.ID);
                            }
                            function getDistrict(value) {
                                $http.get("api/object/GetListDistrict?ID=" + value)
                                   .success(function (response) {
                                           $scope.districtlist = response.data;
                                   }).error(function (data, status, headers, config) {

                                       $scope.msg = data;

                                   });
                            }
                            $scope.checkasgest=function()
                            {
                                $scope.isgest = true;
                                $scope.isregister = false;
                                $("html, body").animate({
                                    scrollTop: $('.info-box').offset().top
                                }, 1000);
                            }
                            
                            $scope.register=function()
                            {
                                $scope.isregister = true;
                                $scope.isgest = false;
                            }
                            if (!$scope.user) {
                                $http.get("api/object/GetGest")
                                  .success(function (response) {
                                      if (response.success) {
                                          console.log(response);
                                          if (response.user) {
                                              $scope.user = response.user;
                                          }
                                      }
                                      else {
                                          $scope.msg = response.msg;
                                      }
                                  }).error(function (data, status, headers, config) {
                                      $scope.msg = data;
                                  });
                            }
                            $scope.checkout = function () {
                                if ($scope.currentUser == null)
                                {
                                    
                                    //post 
                                    $scope.user.Province = $scope.selectedProvince.Province;
                                    var data = $scope.user;
                                    $http({
                                        method: "post",
                                        url: '/api/object/CheckoutAsGest',
                                        data: data,
                                    }).success(function (re, status, headers, config) {
                                        if (re.HasError) {
                                            if (re.ErrorCode == 200) {
                                                //ko tim thay
                                              //
                                            }
                                            else {
                                                flash.error=re.Error;
                                            }
                                        }
                                        else {
                                            //chuyen ve trang list
                                            $state.transitionTo('main.home.review', { shipping: $scope.shippingTransfer })
                                        }
                                    });
                                }
                                else
                                {
                                    $state.transitionTo('main.home.review', { shipping: $scope.shippingTransfer })
                                }
                               
                            }
                            $scope.registeraccount=function()
                            {
                                $scope.userRegister.Province = $scope.selectedProvince.Province;
                                var data = $scope.userRegister;
                                $http({
                                    method: "post",
                                    url: '/api/User/Register',
                                    data: data,
                                }).success(function (data, status, headers, config) {
                                    if(data.success)
                                    {
                                        flash.success = 'Register Success';
                                        $timeout(window.location.reload(), 2000);
                                        
                                    }
                                    else
                                    {
                                        flash.error = data.msg;
                                    }
                                      // this callback will be called asynchronously
                                      // when the response is available
                                  }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                  });
                            }
                            $scope.logon=function()
                            {
                                var data = $scope.userlogin;
                                $http({
                                    method: "post",
                                    url: '/api/User/Login',
                                    data: data,
                                }).success(function (data, status, headers, config) {
                                    $scope.Username = data.FullName;
                                    if (data.success)
                                    {
                                        flash.success = "Login Success";
                                        $timeout( window.location.reload(),2000);
                                       
                                    }
                                    else
                                    {
                                        flash.error=data.msg;
                                    }
                                    // this callback will be called asynchronously
                                    // when the response is available
                                }).
                                  error(function (data, status, headers, config) {
                                      // called asynchronously if an error occurs
                                      // or server returns response with an error status.
                                  });
                            }
                        }]
                   }
               }
           })
            .state('main.home.review', {
                url: "/review/{shipping}",
                ncyBreadcrumb: {
                    label: 'Review Order', parent: null
                },
                data: { title: "Review Order" },
                views: {
                    "homeMain": {
                        templateUrl: _gconfig.baseAppResouceUrl + "/views/checkout/review.html"
                       , controller: ['$scope', '$state', '$http', 'appconfig', "$timeout",'flash',
                         function ($scope, $state, $http, appconfig, $timeout,flash) {
                             GetCart();
                             $scope.user = appconfig.User;
                             
                             if (!$scope.user)
                             {
                                 $http.get("api/object/GetGest")
                                   .success(function (response) {
                                       if (response.success) {
                                           console.log(response);
                                           if (response.user) {
                                               $scope.user = response.user;
                                           }
                                       }
                                       else {
                                           $scope.msg = response.msg;
                                       }
                                   }).error(function (data, status, headers, config) {
                                       $scope.msg = data;
                                   });
                             }
                             $scope.paymentmethod = $state.params.shipping;
                             $scope.shippingfee = 25000;
                             function GetCart() {
                                 $http.get("api/object/GetCart")
                                   .success(function (response) {

                                       if (response.success) {
                                           if (response.user) {
                                               $scope.appconfig.User = response.user;
                                               $scope.People = { gFullName: appconfig.User.gFullName, phone: appconfig.User.Phone, email: appconfig.User.Email, address: appconfig.User.Address };
                                           }
                                           if (response.data.Count <= 0) {
                                               flash.error = "You haven't any item in a Bag";
                                               $timeout(window.location.href = '/', 2000);

                                           }
                                           $scope.cart = response.data;
                                           $(".cartcount").text(response.data.Count);


                                       }
                                       else {
                                           $scope.msg = response.msg;
                                       }
                                   }).error(function (data, status, headers, config) {
                                       $scope.msg = data;
                                   });
                             }
                             $scope.changfee = function (shipping)
                             {
                                 if (shipping =="outcity") {
                                     $scope.shippingfee = 50000;
                                 }
                                 else
                                 {
                                     $scope.shippingfee = 25000;
                                 }
                             }
                             $scope.order=function()
                             {
                                 var data = $scope.user;
                                 $http({
                                     method: "post",
                                     url: '/api/Object/DoOrder',
                                     data: $.extend({ paymentmethod: $scope.paymentmethod, shipfee: $scope.shippingfee }, data)
                                 }).success(function (data, status, headers, config) {
                                     if(data.success)
                                     {
                                         flash.success = "Your order will done , We will contact you soon";
                                         $timeout(window.location.href = '/', 2000)
                                        
                                     }
                                     // this callback will be called asynchronously
                                     // when the response is available
                                 }).
                                   error(function (data, status, headers, config) {
                                       // called asynchronously if an error occurs
                                       // or server returns response with an error status.
                                   });
                             }
                         }]
                    }
                }
            })

});
app.directive('gulzimage', function () {
    return {
        restrict: 'A',
        link: function (scope, $elm) {
            //$elm.lazyload({
            //    effect: "fadeIn"
            //});
            //$elm.attr("src", $elm.attr("data-original"));
        }
    }
});
app.controller("rootController", ["$scope", "$state", "$translate", '$http', function ($scope, $state, $translate, $http) {

}]);

app.filter("range", function () {
    return function (input, total) {
        total = parseInt(total);
        input = [] || input;
        for (var i = 1; i <= total; i++) input.push(i);
        return input;
    }
});

app.directive("ngMatch", ['$parse', function ($parse) {
    var directiveId = 'ngMatch';
    var directive = {
        link: link,
        restrict: 'A',
        require: '?ngModel'
    };
    return directive;

    function link(scope, elem, attrs, ctrl) {
        // if ngModel is not defined, we don't need to do anything
        if (!ctrl) return;
        if (!attrs[directiveId]) return;

        var firstPassword = $parse(attrs[directiveId]);

        var validator = function (value) {
            var temp = firstPassword(scope),
            v = value === temp;
            ctrl.$setValidity('match', v);
            return value;
        }

        ctrl.$parsers.unshift(validator);
        ctrl.$formatters.push(validator);
        attrs.$observe(directiveId, function () {
            validator(ctrl.$viewValue);
        });

    }
}]);