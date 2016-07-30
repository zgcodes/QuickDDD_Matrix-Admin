using System;
using System.Text.RegularExpressions;

namespace Core.Utils
{
    public static class CheckData
    {
        /// <summary>
        /// 判断字符串是否是数字
        /// </summary>
        /// <param name="numStr"></param>
        /// <returns></returns>
        public static bool IsNumber(string numStr)
        {
            if (string.IsNullOrWhiteSpace(numStr) || numStr.Length == 0)
            {
                return false;
            }
            Regex reg = new Regex("^[0-9]+$");
            Match ma = reg.Match(numStr);
            if (ma.Success)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        /// <summary>
        /// 检查手机号格式
        /// </summary>
        /// <param name="phone"></param>
        public static bool CheckMobileFormat(string phone)
        {
            if (string.IsNullOrWhiteSpace(phone) || phone.Length != 11)
            {
                return false;
            }
            else
            {
                Regex regex = new Regex("^1\\d{10}$");
                return regex.IsMatch(phone);
            }
        }

        /// <summary>
        /// 检查身份证号
        /// </summary>
        /// <param name="idCardNumber"></param>
        public static bool CheckIdCardNumberFormat(string idCardNumber)
        {
            if (string.IsNullOrWhiteSpace(idCardNumber))
                return false;
            if (idCardNumber.Length == 15)
            {
                return CheckIDCard15(idCardNumber);
            }
            else if (idCardNumber.Length == 18)
            {
                return CheckIDCard18(idCardNumber);
            }
            else
            {
                return false;
            }
        }

        /// <summary>  
        /// 18位身份证号码验证  
        /// </summary>  
        private static bool CheckIDCard18(string idNumber)
        {
            long n = 0;
            if (long.TryParse(idNumber.Remove(17), out n) == false
                || n < Math.Pow(10, 16) || long.TryParse(idNumber.Replace('x', '0').Replace('X', '0'), out n) == false)
            {
                return false;//数字验证  
            }
            string address = "11x22x35x44x53x12x23x36x45x54x13x31x37x46x61x14x32x41x50x62x15x33x42x51x63x21x34x43x52x64x65x71x81x82x91";
            if (address.IndexOf(idNumber.Remove(2)) == -1)//前两位是省份编码
            {
                return false;//省份验证  
            }
            string birth = idNumber.Substring(6, 8).Insert(6, "-").Insert(4, "-");//6到13位是生日，设置格式为yyyy-MM-dd
            DateTime time = new DateTime();
            if (DateTime.TryParse(birth, out time) == false)
            {
                return false;//生日验证  
            }
            string[] arrVarifyCode = ("1,0,x,9,8,7,6,5,4,3,2").Split(',');//校验码数组
            string[] Wi = ("7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2").Split(',');//前17位的加权因子
            char[] Ai = idNumber.Remove(17).ToCharArray();
            int sum = 0;
            //将前17位数字与其加权因子相乘，再将乘积相加
            for (int i = 0; i < 17; i++)
            {
                sum += int.Parse(Wi[i]) * int.Parse(Ai[i].ToString());
            }
            int y = -1;//校验码数组的下标
            Math.DivRem(sum, 11, out y);//sum除以11取余的结果就是“校验码数组的下标”，进而arrVarifyCode[y]就是校验码
            if (arrVarifyCode[y] != idNumber.Substring(17, 1).ToLower())
            {
                return false;//校验码验证
            }
            return true;//符合GB11643-1999标准  
        }


        /// <summary>  
        /// 15位身份证号码验证  
        /// </summary>  
        private static bool CheckIDCard15(string idNumber)
        {
            long n = 0;
            if (long.TryParse(idNumber, out n) == false || n < Math.Pow(10, 14))
            {
                return false;//数字验证  
            }
            string address = "11x22x35x44x53x12x23x36x45x54x13x31x37x46x61x14x32x41x50x62x15x33x42x51x63x21x34x43x52x64x65x71x81x82x91";
            if (address.IndexOf(idNumber.Remove(2)) == -1)//前两位是省份编码
            {
                return false;//省份验证  
            }
            string birth = idNumber.Substring(6, 6).Insert(4, "-").Insert(2, "-");//6到11位是生日，设置格式为yy-MM-dd
            DateTime time = new DateTime();
            if (DateTime.TryParse(birth, out time) == false)
            {
                return false;//生日验证  
            }
            return true;
        }
    }
}
