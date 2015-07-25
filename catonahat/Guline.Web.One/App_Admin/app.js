﻿
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

app = angular.module('gulineWebApp', ['ui.sortable', 'ngTagsInput', 'ngCkeditor', 'colorpicker.module', 'ui.router', 'ui.bootstrap', 'pascalprecht.translate', 'ncy-angular-breadcrumb', 'chieffancypants.loadingBar', 'ngAnimate', 'ngCookies', 'checklist-model']);
app.config(['$translateProvider', 'cfpLoadingBarProvider', "$sceProvider", '$locationProvider', function ($translateProvider, cfpLoadingBarProvider, $sceProvider, $locationProvider) {
    cfpLoadingBarProvider.includeSpinner = false;
    $translateProvider.useStaticFilesLoader({
        prefix: _gconfig.appPath + '/langs/',
        suffix: '.txt'
    });
    $translateProvider.preferredLanguage('vi-vn');
    $sceProvider.enabled(false);

    $locationProvider.html5Mode(true);

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

app.factory("dataUser", ["$q", function ($q) {
    var defer = $q.defer();
    var dataUser = {};
    dataUser.user = {};
    dataUser.get = function () { return defer.promise;};
    dataUser.set = function (user) { this.user = user; defer.resolve(user); };
    return dataUser;
}]);

app.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        $rootScope.editorOptions = {
            toolbar: [
	            { name: 'document', groups: ['mode', 'document', 'doctools'], items: ['Source', '-', 'Save', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
	            { name: 'clipboard', groups: ['clipboard', 'undo'], items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
	            { name: 'editing', groups: ['find', 'selection', 'spellchecker'], items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
	            { name: 'forms', items: ['Form', 'Checkbox', 'Radio', 'TextField', 'Textarea', 'Select', 'Button', 'ImageButton', 'HiddenField'] },
	            '/',
	            { name: 'basicstyles', groups: ['basicstyles', 'cleanup'], items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'RemoveFormat'] },
	            { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'], items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
	            { name: 'links', items: ['Link', 'Unlink', 'Anchor'] },
	            { name: 'insert', items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
	            '/',
	            { name: 'styles', items: ['Styles', 'Format', 'Font', 'FontSize'] },
	            { name: 'colors', items: ['TextColor', 'BGColor'] },
	            { name: 'tools', items: ['Maximize', 'ShowBlocks'] },
	            { name: 'others', items: ['-'] },
	            { name: 'about', items: ['About'] }
            ], toolbarGroups: [
    { name: 'document', groups: ['mode', 'document', 'doctools'] },
    { name: 'clipboard', groups: ['clipboard', 'undo'] },
    { name: 'editing', groups: ['find', 'selection', 'spellchecker'] },
    { name: 'forms' },
    '/',
    { name: 'basicstyles', groups: ['basicstyles', 'cleanup'] },
    { name: 'paragraph', groups: ['list', 'indent', 'blocks', 'align', 'bidi'] },
    { name: 'links' },
    { name: 'insert' },
    '/',
    { name: 'styles' },
    { name: 'colors' },
    { name: 'tools' },
    { name: 'others' },
    { name: 'about' }
            ],
            language: 'vi',
            allowedContent: true,
            enterMode: CKEDITOR.ENTER_BR,
            filebrowserBrowseUrl: '/ckfinder/ckfinder.html',
            filebrowserImageBrowseUrl: '/ckfinder/ckfinder.html',
            filebrowserUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&amp;type=Files',
            filebrowserImageUploadUrl: '/ckfinder/core/connector/aspx/connector.aspx?command=QuickUpload&amp;type=Images'
        };

        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        $rootScope.msdate = function (dateStr) {
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
            return (day + '/' + m + '/' + d.getFullYear());
        }
        $rootScope.RurlFriendly = url_friendly;

        $rootScope.RgetAttrTypeName = function (input) {
            if (input == 1) {
                return "string";
            }
            else if (input == "11") {
                return "file upload";
            }
            else if (input == "12") {
                return "color";
            }
            else if (input == "13") {
                return "link";
            }
            else if (input == "14") {
                return "rewriteURL";
            }
            else if (input == "15") {
                return "htmleditor";
            }
            else if (input == "17") {
                return "string[]";
            }
            else if (input == "18") {
                return "password";
            }
            else if (input == "21") {
                return "Sort";
            }
            else if (input == "3") {
                return "Port";
            }
        }
    }
])
.config(function ($stateProvider, $urlRouterProvider) {
    //
    $stateProvider
        .state('main', {
            ncyBreadcrumb: {
                label: 'Admin page'
            },
            views: {
                "gMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gMain.html"
                   , controller: ['$scope', '$state', '$http', 'broadcastService', '$modal',
                     function ($scope, $state, $http, broadcastService, $modal) {
                         //recieve broadcast
                         $scope.$on("handleBroadcast", function () {
                             if (broadcastService.data.type == "pleaselogin") {
                                 //begin modal
                                 var modalInstance = $modal.open({
                                     animation: $scope.animationsEnabled,
                                     templateUrl: _gconfig.baseAppResouceUrl + "/gLogin.html",
                                     controller: 'LoginModalCtrl',
                                     backdrop: 'static',
                                     size: 'lg'
                                 });

                                 modalInstance.result.then(function (result) {
                                     //notify logged
                                     broadcastService.prepForBroadcast({ type: "pleaseloadleft" });
                                     //
                                 }, function () {

                                 });
                                 //end modal
                             }
                         });
                         //end recieve broadcast
                     }]
                }//end vMain
            }
        })
        .state('main.admin', {
            ncyBreadcrumb: {
                label: 'Trang chủ', parent: null
            },
            views: {
                "vTop": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/vTop.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                     }]
                }//end vMain
                , "vLeft": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/admin/left.html"
                   , controller: ['$scope', '$state', '$http', 'broadcastService', "dataUser",
                     function ($scope, $state, $http, broadcastService, dataUser) {
                         $scope.oneAtATime = true;
                         $scope.user = _gconfig.user;
                         $scope.logout = function () {
                             if (confirm("Bạn có muốn thoát không?")) {
                                 $http.get(_gconfig.baseWebUrl + '/api/User/Logout').
                                 success(function (data, status, headers, config) {
                                     if (data.success) {
                                         $state.go("login");
                                     }
                                     else {
                                         $scope.msg = data.msg;
                                     }

                                 }).error(function (data, status, headers, config) {
                                     $scope.msg = data;
                                 });
                             }
                         }

                         //
                         $scope.$on("handleBroadcast", function () {
                             if (broadcastService.data.type == "pleaseloadleft") {
                                 loadLeft();
                             }
                         });
                         loadLeft();
                         function loadLeft() {
                             $http.get(_gconfig.baseWebUrl + '/api/Object/ListObject?pagesize=20').
                           success(function (data, status, headers, config) {
                               if (data.success) {
                                   $scope.subjects = data.Data.Items;
                                   $scope.Username = data.Username;
                                   $scope.msg = "";
                                   dataUser.set(data);
                               }
                               else {
                                   if (data.auth == false) {
                                       broadcastService.prepForBroadcast({ type: "pleaselogin" });
                                   }
                                   $scope.msg = data.msg;
                               }

                           }).error(function (data, status, headers, config) {
                               $scope.msg = data;
                           });
                         }
                     }]
                },
                "vRight": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/admin/index.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                     }]
                }//end vMain
            }
        })
              .state('main.admin.manageobjectone', {
                  url: "/manageobjectone/{objectname}",
                  views: {
                      "adMain": {
                          templateUrl: _gconfig.baseAppResouceUrl + "/views/object/manageone.html"
                         , controller: ['$scope', '$state', '$http', '$modal',
                           function ($scope, $state, $http, $modal) {
                               $scope.object = {};
                               $scope.result = { text: "Đang tải dữ liệu....", type: "info" };
                               $scope.running = false;
                               $scope.uploadfile = function ($model) {
                                   var finder = new CKFinder();
                                   finder.selectActionFunction = function (fileUrl) {
                                       $model.AttrValue = fileUrl;
                                       $scope.$apply();
                                   };
                                   finder.popup();
                               }
                               $scope.uploadfileObject = function ($model) {
                                   console.log($model);
                                   var finder = new CKFinder();
                                   finder.selectActionFunction = function (fileUrl) {
                                       $model.gImage = fileUrl;
                                       $model.AttrValueArray.push(fileUrl);
                                       $scope.$apply();
                                   };
                                   finder.popup();
                               }
                               $scope.removeImage = function (item, attr) {
                                   var i = attr.AttrValueArray.indexOf(item);
                                   if (i != -1) {
                                       attr.AttrValueArray.splice(i, 1);
                                   }
                               }
                               $scope.uploadfileBanner = function ($model) {
                                   console.log($model);
                                   var finder = new CKFinder();
                                   finder.selectActionFunction = function (fileUrl) {
                                       $model.gBanner = fileUrl;
                                       $scope.$apply();
                                   };
                                   finder.popup();
                               }
                               $scope.findLink = function (obj) {
                                   //begin modal
                                   var modalInstance = $modal.open({
                                       animation: true,
                                       templateUrl: 'getListLink.html',
                                       controller: 'ModalInstanceCtrl',
                                       size: 'lg',
                                       resolve: {
                                           obj: function () {
                                               return obj;
                                           }
                                       }
                                   });

                                   modalInstance.result.then(function (selectedItem) {
                                       $scope.selected = selectedItem;
                                   }, function () {

                                   });
                                   //end modal
                               };
                               $scope.ok = function () {

                                   $scope.running = true;
                                   $scope.result = { text: "Đang xử lý....", type: "info" };
                                   $scope.object.Attrs.filter(function (attr) { return attr.AttrType == 9 }).forEach(function (attr) {
                                       attr.AttrValue = JSON.stringify(attr.AttrValueArray);
                                   });
                                   $http.post(_gconfig.baseWebUrl + '/api/object/UpdateOneObject', $scope.object).
                                    success(function (res, status, headers, config) {
                                        if (res.success) {
                                            $state.go("main.admin.success", { parentid: $scope.object.ParentID, id: $scope.object.ID, objectname: $scope.object.gObjectName, justone: 1 });
                                        }
                                        else {
                                            $scope.msg = res.msg;
                                        }
                                        $scope.running = false;
                                    }).error(function (data, status, headers, config) {

                                        $scope.msg = data;
                                        $scope.running = false;
                                    });
                               }
                               $http.get(_gconfig.baseWebUrl + '/api/Object/GetOneObject?objectname=' + $state.params.objectname).
                                 success(function (res, status, headers, config) {
                                     if (res.success) {
                                         // $state.current.data.title = res.data.Title;
                                         $scope.object = res.data;

                                         $scope.object.Attrs.filter(function (attr) { return attr.AttrType == 4 }).forEach(function (attr) {
                                             attr.AttrValue = attr.AttrValue=='True' ;
                                         });
                                         $scope.result = {};
                                     }
                                     else {
                                         $scope.result = { text: res.msg, type: "danger" };
                                     }
                                     $scope.running = false;
                                 }).error(function (res, status, headers, config) {
                                     $scope.result = { text: res, type: "danger" };
                                 });
                           }]
                      }//end vMain
                  }
              })
              .state('main.admin.manageobject', {
                  url: "/manageobject/{objectname}",
                  views: {
                      "adMain": {
                          templateUrl: _gconfig.baseAppResouceUrl + "/views/object/manageobject.html"
                         , controller: ['$scope', '$state', '$http', '$modal',
                           function ($scope, $state, $http, $modal) {
                               $scope.checkallchange = function () {
                                   var ischecked = $(".checkall").is(":checked");
                                   if (ischecked) {
                                       $(".chkme").prop("checked", true);
                                   }
                                   else {
                                       $(".chkme").prop("checked", false);
                                   }
                                   var countchecked = $(".chkme:checked").length;
                                   if (countchecked > 0) {
                                       $(".btndelete").removeClass("hidden");
                                   }
                                   else {
                                       $(".btndelete").addClass("hidden");
                                   }
                               }
                               $scope.checkchange = function ($event) {
                                   var ischecked = $event.target.checked;
                                   var countallcheck = $(".chkme").length;
                                   var countchecked = $(".chkme:checked").length;
                                   if (countallcheck == countchecked) {
                                       $(".checkall").prop("checked", true);
                                   }
                                   else {
                                       $(".checkall").prop("checked", false);
                                   }

                                   if (countchecked > 0) {
                                       $(".btndelete").removeClass("hidden");
                                   }
                                   else {
                                       $(".btndelete").addClass("hidden");
                                   }
                               }
                               $scope.delete = function () {
                                   if (confirm("Bạn có thật sự muốn xóa ?")) {
                                       var ids = "";
                                       $(".chkme:checked").each(function (index, item) {
                                           var id = $(item).attr("data-id");
                                           if (ids == "") {
                                               ids = id;
                                           } else {
                                               ids += "," + id;
                                           }
                                       });
                                       //
                                       $http.post(_gconfig.baseWebUrl + '/api/object/DeleteObjects', { IDs: ids }).
                                         success(function (res, status, headers, config) {
                                             if (res.success) {
                                                 $(".chkme:checked").each(function (index, item) {
                                                     $(item).parent().parent().remove();
                                                 });
                                                 $(".btndelete").addClass("hidden");
                                             }
                                             else {
                                                 $scope.msg = res.msg;
                                             }
                                             $scope.running = false;
                                         }).error(function (data, status, headers, config) {

                                             $scope.msg = data;
                                             $scope.running = false;
                                         });
                                       //
                                   }
                               }
                               $scope.updatesort = function () {
                                   var neworder = "";
                                   $scope.page.Items.forEach(function (element, index, array) {
                                       neworder += element.ID + "," + $scope.page.Items.indexOf(element) + "|";
                                   });

                                   $http.post(_gconfig.baseWebUrl + '/api/Object/SortObject', { order: neworder }).
                                 success(function (data, status, headers, config) {
                                     if (data.success) {
                                         //success
                                     }
                                     else {
                                         $scope.msg = data.msg;
                                     }
                                     $scope.running = false;
                                 }).error(function (data, status, headers, config) {
                                     $scope.msg = data;
                                 });
                               }
                               $scope.sortableOptions = {
                                   // called after a node is dropped
                                   stop: function (e, ui) {

                                       $scope.updatesort();
                                   }
                               };


                               $scope.gupagination = {};
                               if ($state.params.page != undefined) {
                                   $scope.gupagination.page = $state.params.page;
                               }
                               else {
                                   $scope.gupagination.page = 1;
                               }
                               if ($state.params.pagesize != undefined) {
                                   $scope.gupagination.itemperpage = $state.params.pagesize;
                               }
                               else {
                                   $scope.gupagination.itemperpage = 12;
                               }
                               getData();
                               $scope.pageChanged = function () {
                                   getData();
                               };
                               $scope.object = {};
                               $scope.result = { text: "Đang tải dữ liệu....", type: "info" };
                               function getData() {
                                   $http.get(_gconfig.baseWebUrl + '/api/Object/GetListObjectData?objectname=' + $state.params.objectname + "&cpageitem=" + $scope.gupagination.itemperpage + "&cpage=" + $scope.gupagination.page).
                                     success(function (res, status, headers, config) {
                                         if (res.success) {
                                             $scope.objectType = res.objectType;
                                             $scope.GroupID = res.GroupID;
                                             if (res.data.TotalItems > 0) {
                                            
                                                 $scope.page = res.data;
                                                 $scope.result = {};

                                                 if (res.data.TotalItems > 0) {
                                                     $scope.gupagination = { totalitems: res.data.TotalItems, itemperpage: res.data.ItemsPerPage, page: res.data.CurrentPage, maxsize: 5 };
                                                 }
                                             }
                                             else {
                                               
                                                 $scope.result = { text: "Chưa có dữ liệu...", type: "info" };
                                             }
                                         }
                                         else {
                                             $scope.result = { text: res.msg, type: "danger" };
                                         }
                                         $scope.running = false;
                                     }).error(function (res, status, headers, config) {
                                         $scope.result = { text: res, type: "danger" };
                                     });
                               }//end getdata()
                               $scope.showmodal = function (value) {
                                   var modalInstance = $modal.open({
                                       animation: $scope.animationsEnabled,
                                       templateUrl: _gconfig.baseAppResouceUrl + "/gAddCat.html",
                                       controller: 'AddCategoryModalCtrl',
                                       size: 'md',
                                       resolve: {
                                           GroupID: function () {
                                               return $scope.GroupID;
                                           }
                                       }
                                   });

                                   modalInstance.result.then(function () {
                                       getData();
                                   }, function () {
                                     
                                   });
                                  
                               }
                              
                              
                           }]
                      }//end vMain
                  }
              })
         .state('main.admin.managechildobject', {
             url: "/managechildobject/{objectname}?parentid",
             views: {
                 "adMain": {
                     templateUrl: _gconfig.baseAppResouceUrl + "/views/object/managechildobject.html"
                    , controller: ['$scope', '$state', '$http',
                      function ($scope, $state, $http) {
                          $scope.checkallchange = function () {
                              var ischecked = $(".checkall").is(":checked");
                              if (ischecked) {
                                  $(".chkme").prop("checked", true);
                              }
                              else {
                                  $(".chkme").prop("checked", false);
                              }
                              var countchecked = $(".chkme:checked").length;
                              if (countchecked > 0) {
                                  $(".btndelete").removeClass("hidden");
                              }
                              else {
                                  $(".btndelete").addClass("hidden");
                              }
                          }
                          $scope.checkchange = function ($event) {
                              var ischecked = $event.target.checked;
                              var countallcheck = $(".chkme").length;
                              var countchecked = $(".chkme:checked").length;
                              if (countallcheck == countchecked) {
                                  $(".checkall").prop("checked", true);
                              }
                              else {
                                  $(".checkall").prop("checked", false);
                              }

                              if (countchecked > 0) {
                                  $(".btndelete").removeClass("hidden");
                              }
                              else {
                                  $(".btndelete").addClass("hidden");
                              }
                          }
                          $scope.delete = function () {
                              if (confirm("Bạn có thật sự muốn xóa ?")) {
                                  var ids = "";
                                  $(".chkme:checked").each(function (index, item) {
                                      var id = $(item).attr("data-id");
                                      if (ids == "") {
                                          ids = id;
                                      } else {
                                          ids += "," + id;
                                      }
                                  });
                                  //
                                  $http.post(_gconfig.baseWebUrl + '/api/object/DeleteObjects', { IDs: ids }).
                                    success(function (res, status, headers, config) {
                                        if (res.success) {
                                            $(".chkme:checked").each(function (index, item) {
                                                $(item).parent().parent().remove();
                                            });
                                            $(".btndelete").addClass("hidden");
                                        }
                                        else {
                                            $scope.msg = res.msg;
                                        }
                                        $scope.running = false;
                                    }).error(function (data, status, headers, config) {

                                        $scope.msg = data;
                                        $scope.running = false;
                                    });
                                  //
                              }
                          }

                          $scope.updatesort = function () {
                              var neworder = "";
                              $scope.page.Items.forEach(function (element, index, array) {
                                  neworder += element.ID + "," + $scope.page.Items.indexOf(element) + "|";
                              });

                              $http.post(_gconfig.baseWebUrl + '/api/Object/SortObject', { order: neworder }).
                            success(function (data, status, headers, config) {
                                if (data.success) {
                                    //success
                                }
                                else {
                                    $scope.msg = data.msg;
                                }
                                $scope.running = false;
                            }).error(function (data, status, headers, config) {
                                $scope.msg = data;
                            });
                          }
                          $scope.sortableOptions = {
                              // called after a node is dropped
                              stop: function (e, ui) {

                                  $scope.updatesort();
                              }
                          };

                          $scope.gupagination = {};
                          $scope.mParentID = 0;

                          if ($state.params.parentid != undefined) {
                              $scope.mParentID = $state.params.parentid;
                          }

                          if ($state.params.page != undefined) {
                              $scope.gupagination.page = $state.params.page;
                          }
                          else {
                              $scope.gupagination.page = 1;
                          }
                          if ($state.params.pagesize != undefined) {
                              $scope.gupagination.itemperpage = $state.params.pagesize;
                          }
                          else {
                              $scope.gupagination.itemperpage = 12;
                          }

                          getData();

                          $scope.pageChanged = function () {
                              getData();
                          };
                          $scope.object = {};
                          $scope.result = { text: "Đang tải dữ liệu....", type: "info" };

                          function getData() {
                              $http.get(_gconfig.baseWebUrl + '/api/Object/GetListChildObjectData?objectname=' + $state.params.objectname + "&cpageitem=" + $scope.gupagination.itemperpage + "&cpage=" + $scope.gupagination.page + "&parentid=" + $scope.mParentID).
                                success(function (res, status, headers, config) {
                                    if (res.success) {
                                        if (res.data.TotalItems > 0) {
                                            $scope.page = res.data;
                                            $scope.result = {};
                                            res.parents.splice(0, 0, { ID: 0, "Title": "--- Tất cả ---" });
                                            $scope.parents = res.parents;

                                            if (res.data.TotalItems > 0) {
                                                $scope.gupagination = { totalitems: res.data.TotalItems, itemperpage: res.data.ItemsPerPage, page: res.data.CurrentPage, maxsize: 5 };
                                            }
                                        }
                                        else {
                                            $scope.page = {};
                                            $scope.result = { text: "Chưa có dữ liệu...", type: "info" };
                                        }
                                    }
                                    else {
                                        $scope.result = { text: res.msg, type: "danger" };
                                    }
                                    $scope.running = false;
                                }).error(function (res, status, headers, config) {
                                    $scope.result = { text: res, type: "danger" };
                                });
                          }//end getdata()
                      }]
                 }//end vMain
             }
         })
        .state('main.admin.editobject', {
            url: "/editobject/{objectname}/{ID}",
            views: {
                "adMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/object/addeditobject.html"
                   , controller: ['$scope', '$state', '$http', '$modal',
                     function ($scope, $state, $http, $modal) {
                         $scope.object = {};
                         $scope.cat = [];
                         $scope.listParentID = [];
                         $scope.checkedPaAttr = [];
                         $scope.parentAttrValue = [];
                         $scope.result = { text: "Đang tải dữ liệu....", type: "info" };
                         $scope.running = false;
                         $scope.saletypes = [{ val: 1, txt: "Miễn phí" }, { val: 2, txt: "Thu phí" }];
                         $scope.publishtypes = [
                           { val: 1, txt: "Sách in" }, { val: 2, txt: "Download" }, { val: 3, txt: "Bộ cài đặt" }
                         ];
                         $scope.$watch('object.Title', function (newvalue, old) {
                             $scope.object.Slug = url_friendly(newvalue);
                         });
                         $scope.uploadfileObject = function ($model) {
                             var finder = new CKFinder();
                             finder.selectActionFunction = function (fileUrl) {
                                 $model.gImage = fileUrl;
                                 $model.AttrValueArray.push(fileUrl);
                                 $scope.$apply();
                             };
                             finder.popup();
                         }
                         $scope.removeImage=function(item,attr)
                         {
                             var i = attr.AttrValueArray.indexOf(item);
                             if (i != -1) {
                                 attr.AttrValueArray.splice(i, 1);
                             }
                         }

                         $scope.uploadfileBanner = function ($model) {
                             console.log($model);
                             var finder = new CKFinder();
                             finder.selectActionFunction = function (fileUrl) {
                                 $model.gBanner = fileUrl;
                                 $scope.$apply();
                             };
                             finder.popup();
                         }
                         $scope.uploadfile = function ($model) {
                             var finder = new CKFinder();
                             finder.selectActionFunction = function (fileUrl) {
                                 $model.AttrValue = fileUrl;
                                 $scope.$apply();
                             };
                             finder.popup();
                         }
                         $scope.findLink = function (obj) {
                             //begin modal
                             var modalInstance = $modal.open({
                                 animation: true,
                                 templateUrl: 'getListLink.html',
                                 controller: 'ModalInstanceCtrl',
                                 size: 'lg',
                                 resolve: {
                                     obj: function () {
                                         return obj;
                                     }
                                 }
                             });

                             modalInstance.result.then(function (selectedItem) {
                                 $scope.selected = selectedItem;
                             }, function () {
                                 $log.info('Modal dismissed at: ' + new Date());
                             });
                             //end modal
                         };
                         $scope.ok = function () {
                             $scope.running = true;
                             $scope.result = { text: "Đang xử lý....", type: "info" };
                             $scope.object.Attrs.filter(function (attr) { return attr.AttrType == 8 }).forEach(function (attr) {
                                 attr.AttrValue = JSON.stringify($scope.parentAttrValue);
                             });
                             $scope.object.Attrs.filter(function (attr) { return attr.AttrType == 9 }).forEach(function (attr) {
                                 attr.AttrValue = JSON.stringify(attr.AttrValueArray);
                             });

                             $scope.object.ParentID = $scope.listParentID.join();
                             $http.post(_gconfig.baseWebUrl + '/api/object/UpdateOneObject', $scope.object).
                              success(function (res, status, headers, config) {
                                  if (res.success) {
                                      $scope.result = { text: "Lưu thành công", type: "success" };
                                      $scope.object.ID = res.data;
                                  }
                                  else {
                                      $scope.result = { text: msg, type: "danger" };
                                  }
                                  $scope.running = false;
                              }).error(function (data, status, headers, config) {

                                  $scope.msg = data;
                                  $scope.running = false;
                              });
                         } 
                         $http.get(_gconfig.baseWebUrl + '/api/Object/editObject?objectname=' + $state.params.objectname + "&ID=" + $state.params.ID).
                           success(function (res, status, headers, config) {
                               if (res.success) {
                                   console.log(res);
                                   $scope.parents = res.parents;
                                   if (res.data.gJustAttr && res.data.hasChild == false) {
                                       $scope.parents = [];
                                   }
                                   else {
                                       $scope.parents = res.parents;

                                       for (var i = 0; i < $scope.parents.length; i++) {
                                           $scope.cat.push({ id: $scope.parents[i].ID, text: $scope.parents[i].Title })
                                       }
                                   }
                                   res.data.ParentID = res.data.ParentID || 0;
                                   if (res.data.ParentID.indexOf(',').length!=-1)
                                   {
                                       $scope.listParentID = res.data.ParentID.split(',').map(function (f) { return parseInt(f);});
                                   }
                                   else
                                   {
                                       $scope.listParentID = new Array[res.data.ParentID];
                                   }
                                   $scope.object = res.data;
                                  
                                   $scope.result = {};
                                   $scope.object.Attrs.filter(function (attr) { return attr.AttrType == 8 }).forEach(function (attr) {
                                       for (var i = 0; i < attr.CustomObjects.ParentArrayConfig.length; i++)
                                       {
                                           var parent = attr.CustomObjects.ParentArrayConfig[i];
                                           var isparent = false;
                                           for (var j = 0; j < attr.CustomObjectsValue.length; j++)
                                           {
                                               if (attr.CustomObjectsValue[j])
                                               {
                                                   if (attr.CustomObjectsValue[j].Color == parent) {
                                                       isparent = true;
                                                   }
                                               }
                                              
                                           }
                                           $scope.checkedPaAttr.push(isparent);
                                           loadCheckCustomObject(attr, parent, isparent, i);
                                       }

                                   });
                               }
                               else {
                                   $scope.result = { text: res.msg, type: "danger" };
                               }
                               $scope.running = false;
                           }).error(function (res, status, headers, config) {
                               $scope.result = { text: res, type: "danger" };
                           });
                        
                  

                         $scope.changePaAttr = function (parentAttr, item, ischeck, index) {
                             loadCheckCustomObject(parentAttr,item,ischeck, index);
                         }
                         function loadCheckCustomObject(parentAttr,item,ischeck, index)
                         {
                             if (ischeck) {

                                 if ($scope.parentAttrValue[index] == null)
                                     $scope.parentAttrValue[index] = {};
                                 $scope.parentAttrValue[index][parentAttr.CustomObjects.ParentType] = item;                             
                                 for (var i = 0; i < parentAttr.CustomObjectsValue.length; i++)
                                 {  
                                     var customvalue = parentAttr.CustomObjectsValue[i];
                                     if (customvalue) {
                                         if (customvalue.Size.length > 0) {

                                             if (customvalue.Color == item) {
                                                 $scope.parentAttrValue[index][parentAttr.CustomObjects.DataType] = customvalue.Size;
                                             }

                                         }
                                     }
                                 }
                             }
                             else {
                                 delete $scope.parentAttrValue[index];
                             }
                     

                         }
                     }]
                }//end vMain
            }
        })
          .state('main.admin.addobject', {
              url: "/addobject/{objectname}",
              views: {
                  "adMain": {
                      templateUrl: _gconfig.baseAppResouceUrl + "/views/object/addeditobject.html"
                     , controller: ['$scope', '$state', '$http', '$modal',
                       function ($scope, $state, $http, $modal) {

                           $scope.result = { text: "Đang tải dữ liệu....", type: "info" };
                           $scope.running = false;
                           $scope.object = {};
                           $scope.cat = [];
                           $scope.listParentID = [];
                           $scope.checkedPaAttr = [];
                           $scope.parentAttrValue = [];
                           $scope.saletypes = [{ val: 1, txt: "Miễn phí" }, { val: 2, txt: "Thu phí" }];
                           $scope.publishtypes = [
                             { val: 1, txt: "Sách in" }, { val: 2, txt: "Download" }, { val: 3, txt: "Bộ cài đặt" }
                           ];
                           $scope.$watch('object.Title', function (newvalue, old) {
                               $scope.object.Slug = url_friendly(newvalue);
                           });
                           $scope.uploadfileObject = function ($model) {
                               var finder = new CKFinder();
                               finder.selectActionFunction = function (fileUrl) {
                                   $model.gImage = fileUrl;
                                   $model.AttrValueArray.push(fileUrl);
                                   $scope.$apply();
                               };
                               finder.popup();
                           }
                           $scope.uploadfileBanner = function ($model) {
                               console.log($model);
                               var finder = new CKFinder();
                               finder.selectActionFunction = function (fileUrl) {
                                   $model.gBanner = fileUrl;
                                   $scope.$apply();
                               };
                               finder.popup();
                           }
                           $scope.uploadfile = function ($model) {
                               var finder = new CKFinder();
                               finder.selectActionFunction = function (fileUrl) {
                                   $model.AttrValue = fileUrl;
                                   $scope.$apply();
                               };
                               finder.popup();
                           }
                           $scope.findLink = function (obj) {
                               //begin modal
                               var modalInstance = $modal.open({
                                   animation: $scope.animationsEnabled,
                                   templateUrl: 'getListLink.html',
                                   controller: 'ModalInstanceCtrl',
                                   size: 'lg',
                                   resolve: {
                                       obj: function () {
                                           return obj;
                                       }
                                   }
                               });

                               modalInstance.result.then(function (selectedItem) {
                                   $scope.selected = selectedItem;
                               }, function () {

                               });
                               //end modal
                           };
                           $scope.ok = function () {

                               $scope.running = true;
                               $scope.result = { text: "Đang xử lý....", type: "info" };
                               $scope.object.Attrs.filter(function (attr) { return attr.AttrType == 8 }).forEach(function (attr) {
                                   attr.AttrValue = JSON.stringify($scope.parentAttrValue);
                               });
                               $scope.object.Attrs.filter(function (attr) { return attr.AttrType == 9 }).forEach(function (attr) {
                                   attr.AttrValue = JSON.stringify(attr.AttrValueArray);
                               });
                             
                               $scope.object.ParentID = $scope.listParentID.join();
                               $http.post(_gconfig.baseWebUrl + '/api/object/UpdateOneObject', $scope.object).
                                success(function (res, status, headers, config) {
                                    if (res.success) {
                                        $scope.result = { text: "Lưu thành công", type: "success" };
                                        $scope.object.ID = res.data;
                                    }
                                    else {
                                        $scope.result = { text: msg, type: "danger" };
                                    }
                                    $scope.running = false;
                                }).error(function (data, status, headers, config) {

                                    $scope.msg = data;
                                    $scope.running = false;
                                });
                           }
                          
                           $http.get(_gconfig.baseWebUrl + '/api/Object/GetOneBaseObject?objectname=' + $state.params.objectname).
                             success(function (res, status, headers, config) {
                                 if (res.success) {
                                     console.log(res);
                                     // $state.current.data.title = res.data.Title;
                                     $scope.parents = res.parents;
                                     if (res.data.gJustAttr && res.data.hasChild == false) {
                                         $scope.parents = [];
                                     }
                                     else {
                                         $scope.parents = res.parents;
                    
                                         for(var i=0; i<$scope.parents.length;i++)
                                         {
                                             $scope.cat.push({ id: $scope.parents[i].ID, text: $scope.parents[i].Title })
                                         }
                                     }
                                     res.data.ParentID = res.data.ParentID || 0;
                                     $scope.object = res.data;
                                     $scope.result = {};
                                 }
                                 else {
                                     $scope.result = { text: res.msg, type: "danger" };
                                 }
                                 $scope.running = false;
                             }).error(function (res, status, headers, config) {
                                 $scope.result = { text: res, type: "danger" };
                             });
                           $scope.changePaAttr = function (parentAttr, item, ischeck, index) {
                               loadCheckCustomObject(parentAttr, item, ischeck, index);
                           }
                           function loadCheckCustomObject(parentAttr, item, ischeck, index) {
                               if (ischeck) {

                                   if ($scope.parentAttrValue[index] == null)
                                       $scope.parentAttrValue[index] = {};
                                   $scope.parentAttrValue[index][parentAttr.CustomObjects.ParentType] = item;
                                   for (var i = 0; i < parentAttr.CustomObjectsValue.length; i++) {
                                       var customvalue = parentAttr.CustomObjectsValue[i];
                                       if (customvalue)
                                           {
                                           if (customvalue.Size.length > 0) {

                                               if (customvalue.Color == item) {
                                                   $scope.parentAttrValue[index][parentAttr.CustomObjects.DataType] = customvalue.Size;
                                               }

                                           }
                                       }
                                   }
                               }
                               else {
                                   delete $scope.parentAttrValue[index];
                               }


                           }
                           
                       }]
                  }//end vMain
              }
          })
        //main.admin.sendmail
           .state('main.admin.viewobject', {
               url: "/viewobject/{objectname}/{ID}",
               views: {
                   "adMain": {
                       templateUrl: _gconfig.baseAppResouceUrl + "/views/object/viewobject.html"
                      , controller: ['$scope', '$state', '$http',
                        function ($scope, $state, $http) {
                            $scope.object = {};
                            $scope.result = { text: "Đang tải dữ liệu....", type: "info" };
                            $scope.running = true;
                            $http.get(_gconfig.baseWebUrl + '/api/Object/findObject?objectname=' + $state.params.objectname + "&ID=" + $state.params.ID).
                              success(function (res, status, headers, config) {
                                  if (res.success) {
                                      // $state.current.data.title = res.data.Title;
                                      $scope.object = res.data;
                                      $scope.result = {};
                                  }
                                  else {
                                      $scope.result = { text: res.msg, type: "danger" };
                                  }

                              }).error(function (res, status, headers, config) {
                                  $scope.result = { text: res, type: "danger" };
                              });
                        }]
                   }//end vMain
               }
           })
        .state('main.admin.sendmail', {
            url: "/sendmail",
            ncyBreadcrumb: {
                label: 'Send mail', parent: null
            },
            data: { title: "Send mail - Administrator" },
            views: {
                "adMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/mail/SendMail.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                         $scope.email = { TemplateID: "" };
                         $scope.result = {};
                         $scope.running = false;
                         $scope.ok = function () {

                             $scope.running = true;
                             $scope.result = { text: "Đang xử lý....", type: "info" };
                             console.log($scope.email);
                             $http.post(_gconfig.baseWebUrl + '/api/object/SendMail', $scope.email).
                              success(function (res, status, headers, config) {
                                  if (res.success) {

                                      $scope.result = { text: "Gửi thành công", type: "success" };

                                  }
                                  else {
                                      $scope.msg = res.msg;
                                  }
                                  $scope.running = false;
                              }).error(function (data, status, headers, config) {

                                  $scope.msg = data;
                                  $scope.running = false;
                              });
                         }
                         //
                         $http.get(_gconfig.baseWebUrl + '/api/Object/GetObjectListTile?objectname=mailtemplate').
                        success(function (res, status, headers, config) {
                            if (res.success) {
                                $scope.templates = res.data;
                            }
                            else {
                                $scope.msg = res.msg;
                            }
                            $scope.running = false;
                        }).error(function (data, status, headers, config) {
                            $scope.msg = data;
                        });
                     }]
                }//end vMain
            }
        })
        .state('main.admin.success', {
            url: "/success/{objectname}p{parentid}-i{id}-{justone}",
            ncyBreadcrumb: {
                label: 'Successfully!', parent: null
            },
            data: { title: "Thao tác thành công" },
            views: {
                "adMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/admin/success.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                         //
                         $scope.obj = { id: 0, parentid: 0, objectname: 0, justone: 0 };
                         if ($state.params.parentid != undefined) {
                             $scope.obj.parentid = $state.params.parentid;
                         }
                         if ($state.params.id != undefined) {
                             $scope.obj.id = $state.params.id;
                         }
                         if ($state.params.objectname != undefined) {
                             $scope.obj.objectname = $state.params.objectname;
                         }
                         if ($state.params.justone != undefined) {
                             $scope.obj.justone = $state.params.justone;
                         }
                         //justone

                     }]
                }//end vMain
            }
        })
        .state('main.admin.home', {
            url: "/",
            ncyBreadcrumb: {
                label: 'Trang chủ', parent: null
            },
            data: { title: "Trang chủ - Administrator" },
            views: {
                "adMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/admin/home.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                     }]
                }//end vMain
            }
        })

        .state('main.admin.objecttype', {
            url: "/objecttype",
            ncyBreadcrumb: {
                label: 'Danh sách loại đối tượng'
            },
            data: { title: "Loại đối tượng" },
            views: {
                "adMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/views/objecttype/index.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                         $scope.updatesort = function () {
                             var neworder = "";
                             $scope.view.Data.Items.forEach(function (element, index, array) {
                                 neworder += element.ID + "," + $scope.view.Data.Items.indexOf(element) + "|";
                             });

                             $http.post(_gconfig.baseWebUrl + '/api/Object/SortObjectGroup', { order: neworder }).
                           success(function (data, status, headers, config) {
                               if (data.success) {
                                   //success
                               }
                               else {
                                   $scope.msg = data.msg;
                               }
                               $scope.running = false;
                           }).error(function (data, status, headers, config) {
                               $scope.msg = data;
                           });
                         }
                         $scope.sortableOptions = {
                             // called after a node is dropped
                             stop: function (e, ui) {
                                 console.log($scope.view.Data.Items);
                                 $scope.updatesort();
                             }
                         };

                         $http.get(_gconfig.baseWebUrl + '/api/Object/ListObject?pagesize=20').
                           success(function (data, status, headers, config) {
                               if (data.success) {
                                   $scope.view = data;
                               }
                               else {
                                   $scope.msg = data.msg;
                               }
                               $scope.running = false;
                           }).error(function (data, status, headers, config) {
                               $scope.msg = data;
                           });
                     }]
                }//end vMain
            }
        })
         .state('main.admin.manageruser', {
             url: "/user",
             ncyBreadcrumb: {
                 label: 'Quản lí người dùng'
             },
             data: { title: "Quản lí người dùng" },
             views: {
                 "adMain": {
                     templateUrl: _gconfig.baseAppResouceUrl + "/views/user/manageruser.html"
                    , controller: ['$scope', '$state', '$http','$modal', "dataUser",
                      function ($scope, $state, $http, $modal, dataUser) {
                          $scope.fillterObject = {
                              Email: "",
                              Phone:""
                          }
                          $scope.page = 1;
                          $scope.pagezise = "10";
                          $scope.currentUser = {};
                          dataUser.get().then(function (user) {
                              $scope.currentUser = user;
                             
                              loadData($scope.page, $scope.pagezise, $scope.fillterObject);
                          });;
                          
                         
                          function loadData(page, itemperpage, fillter)
                          {
                              $http({
                                  method: "post",
                                  url: _gconfig.baseWebUrl + '/api/User/UserManager',
                                  data: $.extend({ UserID: $scope.currentUser.user.ID, Page: page, Pagezise: itemperpage }, fillter),
                              }).success(function (data, status, headers, config) {
                                  $scope.data = data.Data.List;
                                  $scope.page = data.Data.List.CurrentPage;
                                  $scope.pagezise = data.Data.List.ItemsPerPage;
                                  // this callback will be called asynchronously
                                  // when the response is available
                              }).error(function (data, status, headers, config) {
                                          // called asynchronously if an error occurs
                                          // or server returns response with an error status.
                              });
                          }
                          $scope.LoadPage=function()
                          {
                           
                              loadData($scope.page, $scope.pagezise, $scope.fillterObject);
                          }
                          $scope.showInfo=function(value)
                          {
                              var modalInstance = $modal.open({
                                  animation: $scope.animationsEnabled,
                                  templateUrl: _gconfig.baseAppResouceUrl + "/views/user/userinfo.html",
                                  controller: 'UserDetailModalCtrl',
                                  size: 'lg',
                                  resolve: {
                                      UserID: function () {
                                          return value;
                                      }
                                  }
                              });

                              modalInstance.result.then(function () {
                                  loadData($scope.page, $scope.pagezise, $scope.fillterObject);
                              }, function () {

                              });
                          }
                          $scope.showOrder = function (value) {
                              var modalInstance = $modal.open({
                                  animation: $scope.animationsEnabled,
                                  templateUrl: _gconfig.baseAppResouceUrl + "/views/user/historyOrder.html",
                                  controller: 'HistoryOrderModalCtrl',
                                  size: 'lg',
                                  resolve: {
                                      username: function () {
                                          return value;
                                      }
                                  }
                              });

                              modalInstance.result.then(function () {
                                  loadData($scope.page, $scope.pagezise, $scope.fillterObject);
                              }, function () {

                              });
                          }
                 
                      }]
                 }//end vMain
             }
         })
         .state('main.admin.manageorder', {
             url: "/manageorder",
             views: {
                 "adMain": {
                     templateUrl: _gconfig.baseAppResouceUrl + "/views/object/manageorder.html"
                    , controller: ['$scope', '$state', '$http', '$modal',
                      function ($scope, $state, $http, $modal) {
                          $scope.checkallchange = function () {
                              var ischecked = $(".checkall").is(":checked");
                              if (ischecked) {
                                  $(".chkme").prop("checked", true);
                              }
                              else {
                                  $(".chkme").prop("checked", false);
                              }
                              var countchecked = $(".chkme:checked").length;
                              if (countchecked > 0) {
                                  $(".btndelete").removeClass("hidden");
                              }
                              else {
                                  $(".btndelete").addClass("hidden");
                              }
                          }
                          $scope.Status = [{ val: 1, txt: '<span class="label label-info">Đơn hàng mới</span>' }, { val: 2, txt: '<span class="label label-primary">Đã xác nhận</span>' }
                              , { val: 3, txt: '<span class="label label-warning">Đang giao hàng</span>' }, { val: 4, txt: '<span class="label label-success">Hoàn tất</span>' },
                              { val: 5, txt: '<span class="label label-danger">Bị hủy</span>' }
                          ];
                          $scope.getStatus = function (s) {
                              var result = $scope.Status.filter(function (v) {
                                  return v.val === s; // filter out appropriate one
                              })[0];
                              return result.txt;
                          }
                          $scope.checkchange = function ($event) {
                              var ischecked = $event.target.checked;
                              var countallcheck = $(".chkme").length;
                              var countchecked = $(".chkme:checked").length;
                              if (countallcheck == countchecked) {
                                  $(".checkall").prop("checked", true);
                              }
                              else {
                                  $(".checkall").prop("checked", false);
                              }

                              if (countchecked > 0) {
                                  $(".btndelete").removeClass("hidden");
                              }
                              else {
                                  $(".btndelete").addClass("hidden");
                              }
                          }
                          $scope.showdetail = function (order) {
                              var modalInstance = $modal.open({
                                  animation: $scope.animationsEnabled,
                                  templateUrl: _gconfig.baseAppResouceUrl + "/views/order/orderdetail.html",
                                  controller: 'OrderDetailModalCtrl'
                                  , resolve: {
                                      order: function () {
                                          return order;
                                      }
                                  },
                                  size: 'lg'

                              });

                              modalInstance.result.then(function (result) {
                                  console.log(result);
                              }, function () {

                              });
                              //end modal
                          }
                          $scope.delete = function () {
                              if (confirm("Bạn có thật sự muốn xóa ?")) {
                                  var ids = "";
                                  $(".chkme:checked").each(function (index, item) {
                                      var id = $(item).attr("data-id");
                                      if (ids == "") {
                                          ids = id;
                                      } else {
                                          ids += "," + id;
                                      }
                                  });
                                  //
                                  $http.post(_gconfig.baseWebUrl + '/api/object/DeleteOrders', { IDs: ids }).
                                    success(function (res, status, headers, config) {
                                        if (res.success) {
                                            $(".chkme:checked").each(function (index, item) {
                                                $(item).parent().parent().remove();
                                            });
                                            $(".btndelete").addClass("hidden");
                                        }
                                        else {
                                            $scope.msg = res.msg;
                                        }
                                        $scope.running = false;
                                    }).error(function (data, status, headers, config) {

                                        $scope.msg = data;
                                        $scope.running = false;
                                    });
                                  //
                              }
                          }


                          $scope.gupagination = {};
                          $scope.mParentID = 0;

                          if ($state.params.parentid != undefined) {
                              $scope.mParentID = $state.params.parentid;
                          }

                          if ($state.params.page != undefined) {
                              $scope.gupagination.page = $state.params.page;
                          }
                          else {
                              $scope.gupagination.page = 1;
                          }
                          if ($state.params.pagesize != undefined) {
                              $scope.gupagination.itemperpage = $state.params.pagesize;
                          }
                          else {
                              $scope.gupagination.itemperpage = 12;
                          }

                          getData();

                          $scope.pageChanged = function () {
                              getData();
                          };
                          $scope.object = {};
                          $scope.result = { text: "Đang tải dữ liệu....", type: "info" };

                          function getData() {
                              $http.get(_gconfig.baseWebUrl + '/api/Object/GetListOrder?objectname=' + $state.params.objectname + "&cpageitem=" + $scope.gupagination.itemperpage + "&cpage=" + $scope.gupagination.page + "&parentid=" + $scope.mParentID).
                                success(function (res, status, headers, config) {
                                    if (res.success) {
                                        if (res.data.TotalItems > 0) {
                                            $scope.page = res.data;
                                            $scope.result = {};

                                            $scope.parents = res.parents;

                                            if (res.data.TotalItems > 0) {
                                                $scope.gupagination = { totalitems: res.data.TotalItems, itemperpage: res.data.ItemsPerPage, page: res.data.CurrentPage, maxsize: 5 };
                                            }
                                        }
                                        else {
                                            $scope.page = {};
                                            $scope.result = { text: "Chưa có dữ liệu...", type: "info" };
                                        }
                                    }
                                    else {
                                        $scope.result = { text: res.msg, type: "danger" };
                                    }
                                    $scope.running = false;
                                }).error(function (res, status, headers, config) {
                                    $scope.result = { text: res, type: "danger" };
                                });
                          }//end getdata()
                      }]
                 }//end vMain
             }
         })
        .state('login', {
            url: "/login",
            data: { title: "User Login" },
            views: {
                "gMain": {
                    templateUrl: _gconfig.baseAppResouceUrl + "/gLogin.html"
                   , controller: ['$scope', '$state', '$http',
                     function ($scope, $state, $http) {
                         $scope.msg = "";
                         $scope.running = false;
                         $scope.ok = function () {
                             $scope.running = true;
                             $http.post(_gconfig.baseWebUrl + '/api/user/login', $scope.LogOn).
                               success(function (data, status, headers, config) {
                                   if (data.success) {
                                       $scope.msg = "";
                                       $state.go("main.admin.home");
                                   }
                                   else {
                                       $scope.msg = data.msg;
                                   }
                                   $scope.running = false;
                               }).error(function (data, status, headers, config) {

                                   $scope.msg = data;
                                   $scope.running = false;
                               });

                         }
                     }]
                }//end login
            }
        });

    //next route


});
app.controller("rootController", ["$scope", "$state", "$translate", '$http', function ($scope, $state, $translate, $http) {

}]);
app.controller('ModalInstanceCtrl', function ($scope, $http, $modalInstance, obj) {
    $scope.obj = obj;
    $scope.list = {};
    // '/api/Object/GetLinkPanelObjects?objects=video,book,soft,news,course'
    $http.get(_gconfig.baseWebUrl + '/api/Object/GetLinkPanelObjects?objects=video,book,soft,news,course').
        success(function (data, status, headers, config) {
            if (data.success) {
                $scope.list = data.data;
            }
            else {
                $scope.msg = data.msg;
            }

        }).error(function (data, status, headers, config) {
            $scope.msg = data;
        });
    $scope.choose = function (ch) {
        if (ch.objectgroup) {
            obj.AttrValue = "/" + ch.objectgroup + "/view";
        }
        else {
            obj.AttrValue = "/" + ch.objectslug + "-i" + ch.objectid;
        }
        $modalInstance.close();
    }
    $scope.ok = function () {
        $modalInstance.close();
        //$modalInstance.close($scope.selected.item);
    };
    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };
});
//LoginModalCtrl
app.controller('LoginModalCtrl', function ($scope, $http, $modalInstance) {

    $scope.msg = "";
    $scope.running = false;
    $scope.ok = function () {
        $scope.running = true;
        $http.post(_gconfig.baseWebUrl + '/api/user/login', $scope.LogOn).
          success(function (data, status, headers, config) {
              if (data.success) {
                  $modalInstance.close(true);
              }
              else {
                  $scope.msg = data.msg;
              }
              $scope.running = false;
          }).error(function (data, status, headers, config) {

              $scope.msg = data;
              $scope.running = false;
          });

    }

});

//Add Category Item
app.controller('AddCategoryModalCtrl', function ($scope, $http, $modalInstance, GroupID) {

    $scope.msg = "";
    $scope.GroupID = GroupID;
    $scope.running = false;
    $scope.object = {};
    $scope.object.gGroupID = GroupID;
    $scope.$watch('object.Title', function (newvalue, old) {
        if(newvalue != null)
            $scope.object.Slug = url_friendly(newvalue);
    })
    $scope.ok = function () {
        $scope.running = true;
        $http.post(_gconfig.baseWebUrl + '/api/object/UpdateOneObject', $scope.object).
                                     success(function (res, status, headers, config) {
                                         if (res.success) {
                                             $scope.result = { text: "Lưu thành công", type: "success" };
                                             $scope.object.ID = res.data;
                                             $modalInstance.close();
                                         }
                                         else {
                                             $scope.result = { text: msg, type: "danger" };
                                         }
                                         $scope.running = false;
                                     }).error(function (data, status, headers, config) {

                                         $scope.msg = data;
                                         $scope.running = false;
                                     });
    }

});
app.controller('UserDetailModalCtrl', function ($scope, $http, $modalInstance, UserID)
{
    $scope.ID = UserID;
    $scope.msg = "";
    $scope.running = false;
    init();
    function init()
    {
        $http({
            method: "post",
            url: _gconfig.baseWebUrl + '/api/User/GetDetailUser',
            data: { UserID: $scope.ID },
        }).success(function (data, status, headers, config) {
            $scope.data = data.data;
            // this callback will be called asynchronously
            // when the response is available
        }).error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
        });
    }
    $scope.ok = function (obj) {
        $scope.running = true;
        console.log(obj);
        $http.post(_gconfig.baseWebUrl + '/api/User/Update',obj).
                                     success(function (res, status, headers, config) {
                                         if (res.success) {
                                             $scope.result = { text: "Lưu thành công", type: "success" };
                                             $modalInstance.close();
                                         }
                                         else {
                                             $scope.result = { text: msg, type: "danger" };
                                         }
                                         $scope.running = false;
                                     }).error(function (data, status, headers, config) {

                                         $scope.msg = data;
                                         $scope.running = false;
                                     });
    }

});
//Order detail modal
app.controller('OrderDetailModalCtrl', function ($scope, $http, $modalInstance, order) {
    $scope.order = order;

    $scope.publishtypes = [
                        { val: 8, txt: "bộ sản phẩm" }, { val: 7, txt: "sản phẩm" }, { val: 6, txt: "hộp" }, { val: 5, txt: "chai" }, { val: 4, txt: "kg" }, { val: 1, txt: "Sách in" }, { val: 2, txt: "Download" }, { val: 3, txt: "Bộ cài đặt" }
    ];
    $scope.getpublishStatus = function (s) {
        if (s == "" || s == null)
            return "";
        var result = $scope.publishtypes.filter(function (v) {
            return v.val === s; // filter out appropriate one
        })[0];
        return result.txt;
    }

    $scope.updatePStatus = function (order) {
        $http.post(_gconfig.baseWebUrl + '/api/object/UpdateOrderStatus', { ID: order.ID, Status: order.PaymentStatus }).
          success(function (data, status, headers, config) {
              if (data.success) {
                  $scope.msg = "<span class='alert alert-success'>Cập nhật thành công.</span>";
              }
              else {
                  $scope.msg = "<span class='alert alert-success'>" + data.msg + "</span>";
              }
              $scope.running = false;
          }).error(function (data, status, headers, config) {

              $scope.msg = data;
              $scope.running = false;
          });

    };
    $scope.Status = [{ val: 1, txt: 'Đơn hàng mới' }, { val: 2, txt: 'Đã xác nhận' }
                             , { val: 3, txt: 'Đang giao hàng' }, { val: 4, txt: 'Hoàn tất' },
                             { val: 5, txt: 'Bị hủy' }
    ];
    $scope.getStatus = function (s) {
        if (s == "" || s == null)
            return "";
        var result = $scope.Status.filter(function (v) {
            return v.val === s; // filter out appropriate one
        })[0];
        return result.txt;
    }


    $http.get(_gconfig.baseWebUrl + '/api/Object/OrderDetail?ID=' + order.ID).
            success(function (data, status, headers, config) {
                if (data.success) {
                    $scope.details = data.data;
                    console.log(data);
                }
                else {
                    $scope.msg = data.msg;
                }
                $scope.running = false;
            }).error(function (data, status, headers, config) {
                $scope.msg = data;
            });
    $scope.msg = "";
    $scope.running = false;
    $scope.ok = function () {

    }

});
app.controller('HistoryOrderModalCtrl', function ($scope, $http,$state, $modalInstance, username) {
    $scope.username = username;
    $scope.gupagination = {};
    $scope.showRow = [];
    if ($state.params.page != undefined) {
        $scope.gupagination.page = $state.params.page;
    }
    else {
        $scope.gupagination.page = 1;
    }
    if ($state.params.pagesize != undefined) {
        $scope.gupagination.itemperpage = $state.params.pagesize;
    }
    else {
        $scope.gupagination.itemperpage = 120;
    }
    gethistoryorder();
    $scope.pageChanged = function () {
        gethistoryorder();
    };
    function gethistoryorder() {
        $http({
            method: "post",
            url: '/api/Object/GetMyOrdersByUser',
            data: { username: $scope.username, cpage: $scope.gupagination.page, cpageitem: $scope.gupagination.itemperpage },
        }).success(function (res, status, headers, config) {

            if (!res.success) {
                flash.error = res.msg;
            }
            else {
                $scope.data = res.data;
                console.log($scope.data);
                if (res.data.TotalItems > 0) {
                    $scope.gupagination = { totalitems: res.data.TotalItems, itemperpage: res.data.ItemsPerPage, page: res.data.CurrentPage, maxsize: 5 };
                }
            }
        });
    }
});



