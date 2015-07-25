using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Guline.Web.One.DInject;
using Guline.Web.One.Models;
using Guline.Web.One.gModels;
using System.Security.Cryptography;
using System.Text;
using PetaPoco;

namespace Guline.Web.One.DIImpl
{
    public class UserService : IUserService
    {
        
        private mContext db;

        public UserService(mContext _db)
        {
            this.db = _db;
        }
        public gModels.User findByEmailPassword(string email, string password)
        {
            return db.FirstOrDefault<gModels.User>("select u.ID,u.Email,u.Image,u.gOrganizeID from [User] u join [Group] g on g.ID=u.GroupID where u.Email=@0 and u.[Password]=@1", email, password);            
        }


        public gModels.gOrganize findOrganize(string name)
        {
            return db.FirstOrDefault<gModels.gOrganize>("select top (1) * from gOrganize where Name=@0 and Status=1",name);            

        }
        #region HasPassword
        private const int SaltHashLength = 7;
        private static string HashPassword(string text)
        {
            byte[] salt = CreateRandomSalt(SaltHashLength);
            return Hash(text, salt);
        }
        private static byte[] CreateRandomSalt(int length)
        {
            // Create a buffer 
            byte[] randBytes;

            if (length >= 1)
            {
                randBytes = new byte[length];
            }
            else
            {
                randBytes = new byte[1];
            }

            // Create a new RNGCryptoServiceProvider.
            RNGCryptoServiceProvider rand = new RNGCryptoServiceProvider();

            // Fill the buffer with random bytes.
            rand.GetBytes(randBytes);

            // return the bytes. 
            return randBytes;
        }
        private static string Hash(string text, byte[] salt)
        {
            SHA256 encode = SHA256.Create();
            byte[] pwd = encode.ComputeHash(Encoding.Unicode.GetBytes(text));
            byte[] hash = new byte[pwd.Length + salt.Length];
            for (var i = 0; i < hash.Length; i++)
            {
                if (i < salt.Length)
                {
                    hash[i] = salt[i];
                }
                else
                {
                    hash[i] = pwd[i - salt.Length];
                }
            }
            return Convert.ToBase64String(hash);

        }
        private static bool ComparerHash(string dbPassword, string inputPassword)
        {
            byte[] dbHash;
            try
            {
                dbHash = Convert.FromBase64String(dbPassword);
            }
            catch { return false; }
            if (dbHash.Length <= SaltHashLength)
            {
                return false;
            }
            var salt = new byte[SaltHashLength];

            for (var i = 0; i < SaltHashLength; i++)
            {
                salt[i] = dbHash[i];
            }
            if (dbPassword == Hash(inputPassword, salt))
            {
                return true;
            }
            return false;

        }
        #endregion
        public User CreateAccount(User model)
        {
            model.GroupID = 3;
            model.Password = HashPassword(model.Password);
            db.Insert(model);
            return model;
        }
        public User VaildationLogin(string loginName, string password)
        {
            if (string.IsNullOrWhiteSpace(loginName) || string.IsNullOrWhiteSpace(password))
            {
                return null;
            }
            var userLogin = GetUserByLoginName(loginName);
            if (userLogin != null && ComparerHash(userLogin.Password, password))
            {
                return userLogin;
            }
            return null;
        }
        private User GetUserByLoginName(string loginName)
        {
            var kq = db.SingleOrDefault<User>("SELECT * FROM [User] where [Email]=@0", loginName);
            return kq;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="ID">UserID</param>
        /// <returns></returns>
        private User GetUSerByID(long ID)
        {
            var kq = db.SingleOrDefault<User>("SELECT * FROM [User] where [ID]=@0", ID);
            return kq;
        }
        public User GetUserByEmail(string email)
        {
            return db.FirstOrDefault<gModels.User>("select ID,FullName,Phone,Email,Gender,Address,Province,District from [User] where [Email]=@0", email);
        }
        public Page<User> GetListUserByUser(long UserID, int Page, int Pagezise, UserFillter fillter)
        {
            var user = GetUSerByID(UserID);
            if(user.GroupID==4)
            {
                return db.Page<User>(Page, Pagezise, @"Select * from [User] where GroupID <> @GroupID order by ID DESC", new { GroupID = user.GroupID });
            }
            else
            {
                return db.Page<User>(Page, Pagezise, @"Select * from [User] where GroupID in (2,3) AND ID <> @ID order by ID DESC", new {ID=UserID });
            }
        }
        public User GetUserDetail(long UserID)
        {
            return GetUSerByID(UserID);
        }
        public int Update(User user)
        {
                var current =GetUSerByID(user.ID);
                if (!String.IsNullOrEmpty(user.Password))
                {
                    if (ComparerHash(current.Password, user.Password))
                    {
                        user.Password = HashPassword(user.Password);
                        user.GroupID = 3;
                        db.Update(user);
                        return 0;
                    }
                    else
                    {
                        return 1;
                    }
                }
                else
                {
                    db.Update("User", "ID", new { ID = user.ID, FullName = user.FullName, Gender = user.Gender, Email = user.Email, Phone = user.Phone, Address = user.Address });
                    return 1;
                }
        
        }
        public bool CheckRole(string username)
        {
            var count = db.ExecuteScalar<int>("Select count(1) from [User] WHERE Email=@0 and [GroupID]=1", username);
            if(count==1)
            { return true; }
            return false;
        }
    }
}