//2018-10-18 P002 路海朋 添加
function aa() {
	alert('aa')
}

_BI = {
	/**
	 * 最原始ajax调用方法，不推荐使用
	 * 
	 * @method _BI.ajax
	 * @param {Array}
	 *            options 参数
	 * @param {Function}
	 *            success 成功后执行的方法
	 * @param {Function}
	 *            fail 失败后执行的方法
	 */
	ajax: function(options, success, fail) {
		$.ajax({
			url:options.url,
			dataType: "json",
			context: this,
			data: options.data,
			type: options.type,
			async: options.async,
			success: function(obj) {
				if(obj && obj.error) {
					// 返回了错误码
					if(this.ERROR.HandleError(obj, options.theForm)) // 已经成功处理了错误
						return

					// 未处理，需要交由应用自己处理
					if(fail)
						fail(obj.error);
					else
						// 应用不处理错误，尝试简单显示错误提示
						alert(obj.error)

					return
				}

				/*if(typeof success=="string"){ // 登录后跳转原页面
							if(success)
								_BI.alertSuccess(success,function(){
									_BI.autogo("",options.theForm,options.data);
								});
							else
								this.autogo("",options.theForm,options.data);
							return
				}*/
				// success是函数，应用需要自己处理
				if(success) success(obj);
				/*else{
					this.autogo("",options.theForm,options.data);
				}*/
			},
			error: function(h, e) {
				// 这里只有网络错误，服务器返回500 404错误，或者返回非json数据时

				alert("status=" + h.status + " e=" + e)

				// if (success) // 不需要处理的，即便发生错误也不提示
				// alert("数据传输失败，请稍候重试！\n可能因为您操作过于频繁");
			}
		})
	},
	/**
	 * ajax通过HTTP的GET
	 * 
	 * @method _BI.GetHTTP
	 * @param {string}
	 *            url url地址
	 * @param {Function}
	 *            success 成功后执行的方法
	 * @param {Function}
	 *            fail 失败后执行的方法
	 */
	GetData: function(url, data, success, fail) {
		var data1 = '';
		for(var k in data) {
			//去掉undefined
			var value = data[k] !== undefined ? data[k] : '';
			data1 = data1 + '&' + k + '=' + encodeURIComponent(value);
		}
		data1 = data1.replace(/&/, '?')
		url = url + data1
		_BI.ajax({
			url: url
		}, success, fail);
	},
	/**
	 * ajax通过Post异步传值
	 * 
	 * @method _BI.PostData
	 * @param {string}
	 *            url 后台方法名
	 * @param {Array}
	 *            data 传的数据
	 * @param {Function}
	 *            success 成功后执行的方法
	 * @param {Function}
	 *            fail 失败后执行的方法
	 */
	PostData: function(url, data, success, fail) {
		_BI.ajax({
			url: url,
			data: data,
			type: "POST"
		}, success, fail);
	},
	/**
	 * ajax通过Post同步传值  不返回则不加载之后的js
	 * 
	 * @method _BI.PostDataSync
	 * @param {string}
	 *            action 方法名
	 * @param {Array}
	 *            data 传的数据
	 * @param {Function}
	 *            success 成功后执行的方法
	 * @param {Function}
	 *            fail 失败后执行的方法
	 */
	PostDataSync: function(url, data, success, fail) {
		_BI.ajax({
			async: false,
			url: url,
			data: data,
			type: "POST"
		}, success, fail);
	},
	/**
	 * ajax通过Form发送
	 * 
	 * @method _BI.SendForm
	 * @param {attribute}
	 *            theForm 表单引用
	 * @param {Function}
	 *            success 成功后执行的方法,如果是字符串，则表示成功提示 成功后，还会根据theForm.autogo参数来自动跳转
	 * @param {Function}
	 *            fail 失败后执行的方法
	 * @param {Array}
	 *            denyAry form里拒绝的参数，不提交这些参数
	 */
	SendForm: function(url, theForm, success, fail, data, denyAry) {
		if(!denyAry) denyAry = [];

		// var data = {};// ajax传的值
		if(!data)
			data = {};

		for(var i = 0; i < theForm.length; i++) {
			var o = theForm[i];
			// 获取表单中有name的控件
			if(!o.name || o.disabled) continue;

			if(denyAry.indexOf(o.name) >= 0)
				continue;

			if((o.type == "radio" || o.type == "checkbox") && !o.checked)
				continue;

			var tips = o.getAttribute('tips');
			if(o.getAttribute('notNull') != null && _BI.check.isNull(o.value)) {
				alert(tips + '不能为空！');
				return;
			}

			var bitype = o.getAttribute('bi-type'),
				rst;
			if(bitype != null) {
				switch(bitype.toLowerCase()) {
					case 'bilogname':
						if(!_BI.check.bilogname(o.value)) {
							alert('用户名格式错误(英文开头6-16位)！');
							return;
						}
						break;
					case 'bipasswd':
						if(!_BI.check.bipasswd(o.value)) {
							alert('密码位数需8-18位！');
							return;
						}
						break;
					case 'bicardid':
						o.value = _BI.check.trim(o.value) || o.value;
						if(!_BI.check.isCardID(o.value)) {
							alert('身份证非法，请检查！');
							return;
						}
						break;
					case 'bishouji':
						o.value = _BI.check.trim(o.value) || o.value;
						if(!_BI.check.isSJ(o.value)) {
							alert('请输入正确的手机号码！');
							return;
						}
						break;
					case 'biint':
						rst = _BI.check.biint(o.value);
						if(!rst.result) {
							alert(tips + '' + rst.errMsg);
							return;
						}
						break;
					case 'bimoney':
						rst = _BI.check.bimoney(o.value);
						if(!rst.result) {
							alert(tips + '' + rst.errMsg);
							return;
						}
						break;
					case 'bistr':
						rst = _BI.check.bistr(o.value);
						if(!rst.result) {
							alert(tips + '' + rst.errMsg);
							return;
						}
						break;
					default:
						break;
				}
			}
			if(data[o.name])
				data[o.name] += "," + o.value;
			else
				data[o.name] = o.value;
		};
		_BI.ajax({
			url: url,
			data: data,
			theForm: theForm, // 保存form引用
			type: theForm.getAttribute("method") || "post"
		}, success, fail);
	}
}
_BI.regExps = {
	logname: /^[A-Za-z]\w{4,19}$/, // 首字符为英文，5-20位
	telphone: /^[1][\d]{10}$/ // 1打头的11位数字
};
_BI.check = {
	checkList: {
		isNull: false
	},
	// 将form字段格式化，去除前后空格
	trimForm: function(z) {
		var v = this.trim(z.value)
		// 不同时才设置
		if(z.value != v) z.value = v
	},

	lognameTiShi: "首字符为字母，5-20位",
	isValidLogName: function(name) {
		return _BI.regExps.logname.test(name);
	},

	passwdTishi: "5-20位字符",

	isValidPasswd: function(passwd) {
		if(!passwd) return false
		return passwd.length <= 20 && passwd.length >= 6
	},
	// 检查是否手机号码
	isSJ: function(sj) {
		return _BI.regExps.telphone.test(sj)
	},

	// 校验 身份证
	isCardID: function(cardID) {
		var _vcity = {
			11: "北京",
			12: "天津",
			13: "河北",
			14: "山西",
			15: "内蒙古",
			21: "辽宁",
			22: "吉林",
			23: "黑龙江",
			31: "上海",
			32: "江苏",
			33: "浙江",
			34: "安徽",
			35: "福建",
			36: "江西",
			37: "山东",
			41: "河南",
			42: "湖北",
			43: "湖南",
			44: "广东",
			45: "广西",
			46: "海南",
			50: "重庆",
			51: "四川",
			52: "贵州",
			53: "云南",
			54: "西藏",
			61: "陕西",
			62: "甘肃",
			63: "青海",
			64: "宁夏",
			65: "新疆",
			71: "台湾",
			81: "香港",
			82: "澳门",
			91: "国外"
		};
		// 检查号码是否符合规范，包括长度，类型
		var _isCardNo = function(obj) {
			// 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
			return /(^\d{15}$)|(^\d{17}(\d|X)$)/.test(obj);
		};
		// 取身份证前两位,校验省份
		var _checkProvince = function(obj) {
			var province = obj.substr(0, 2);
			return !!_vcity[province];
		};
		// 检查生日是否正确
		var _checkBirthday = function(obj) {
			var len = obj.length,
				arr_data, year, month, day, birthday;
			// 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
			if(len == '15') {
				var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
				arr_data = obj.match(re_fifteen);
				year = arr_data[2];
				month = arr_data[3];
				day = arr_data[4];
				birthday = new Date('19' + year + '/' + month + '/' + day);
				return _verifyBirthday('19' + year, month, day, birthday);
			}
			// 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
			if(len == '18') {
				var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
				arr_data = obj.match(re_eighteen);
				year = arr_data[2];
				month = arr_data[3];
				day = arr_data[4];
				birthday = new Date(year + '/' + month + '/' + day);
				return _verifyBirthday(year, month, day, birthday);
			}
			return false;
		};
		// 校验日期
		var _verifyBirthday = function(year, month, day, birthday) {
			var now = new Date();
			var now_year = now.getFullYear();
			// 年月日是否合理
			if(birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
				// 判断年份的范围（0岁到150岁之间)
				var time = now_year - year;
				return(time >= 0 && time <= 150);
			}
			return false;
		};
		// 校验位的检测
		var _checkParity = function(obj) {
			// 15位转18位
			obj = _changeFifteenToEighteen(obj);
			var len = obj.length;
			if(len == '18') {
				var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
					arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'],
					cardTemp = 0,
					i,
					valnum;
				for(i = 0; i < 17; i++) {
					cardTemp += obj.substr(i, 1) * arrInt[i];
				}
				valnum = arrCh[cardTemp % 11];
				return(valnum == obj.substr(17, 1));
			}
			return false;
		};
		// 15位转18位身份证号
		var _changeFifteenToEighteen = function(obj) {
			if(obj.length == '15') {
				var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
				var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
				var cardTemp = 0,
					i;
				obj = obj.substr(0, 6) + '19' + obj.substr(6, obj.length - 6);
				for(i = 0; i < 17; i++) {
					cardTemp += obj.substr(i, 1) * arrInt[i];
				}
				obj += arrCh[cardTemp % 11];
				return obj;
			}
			return obj;
		};
		// 去首尾空字符，在进行非空校验
		if((cardID = this.trim(cardID)) === false) {
			return false
		}
		// 校验长度，类型
		if(_isCardNo(cardID) === false) {
			return false;
		}
		// 检查省份
		if(_checkProvince(cardID) === false) {
			return false;
		}
		// 校验生日
		if(_checkBirthday(cardID) === false) {
			return false;
		}
		// 检验位的检测
		return _checkParity(cardID);

	},
	// 校验 logname
	bilogname: function(name) { // 首字符为英文，6-16位
		name = this.trim(name);
		return name; // && _BI.regExps.logname.test(name);
	},
	// 校验 密码
	bipasswd: function(passwd) { // 密码为英文字母和数字组合8-16位
		passwd = this.trim(passwd);
		return passwd; //&& _BI.regExps.passwd.test(passwd);
	},
	// 校验整数（最大，最小，是否可空）
	biint: function(val, checkInfo) {
		if(!_BI.check.isInteger(val)) {
			return {
				result: false,
				errMsg: "不是整数！"
			};
		}
		var arr = checkInfo.split(';'),
			i, tmp;
		for(i = 0; i < arr.length; i++) {
			tmp = arr[i].split('=');
			switch(tmp[0]) {
				case 'max':
					if(_BI.check.isMoreThan(+val, +tmp[1])) {
						return {
							result: false,
							errMsg: '不能大于' + tmp[1] + '！'
						};
					}
					break;
				case 'min':
					if(_BI.check.isLessThan(+val, +tmp[1])) {
						return {
							result: false,
							errMsg: '不能小于' + tmp[1] + '！'
						};
					}
					break;
			}
		}
		return {
			result: true
		};
	},
	// 校验浮点数（最大，最小，小数位数）
	bimoney: function(val, checkInfo) {
		if(!_BI.check.isDigits(val)) {
			return {
				result: false,
				errMsg: "不是数字！"
			};
		}
		var arr = checkInfo.split(';'),
			i, tmp;
		for(i = 0; i < arr.length; i++) {
			tmp = arr[i].split('=');
			switch(tmp[0]) {
				case 'precision':
					if(_BI.check.isPrecision(+val, +tmp[1])) {
						return {
							result: false,
							errMsg: '保留' + tmp[1] + '位有效小数！'
						};
					}
					break;
				case 'max':
					if(_BI.check.isMoreThan(+val, +tmp[1])) {
						return {
							result: false,
							errMsg: '不能大于' + tmp[1] + '！'
						};
					}
					break;
				case 'min':
					if(_BI.check.isLessThan(+val, +tmp[1])) {
						return {
							result: false,
							errMsg: '不能小于' + tmp[1] + '！'
						};
					}
					break;
			}
		}
		return {
			result: true
		};
	},
	// 字符串校验（控制最大，最小长度，允许甚至可以加上正则验证）
	bistr: function(val, checkInfo) {
		var arr = checkInfo.split(';'),
			i, tmp;
		for(i = 0; i < arr.length; i++) {
			tmp = arr[i].split('=');
			switch(tmp[0]) {
				case 'regexp':
					try {
						var regExp = new RegExp(tmp[1]);
						if(!regExp.test(str)) {
							return {
								result: false,
								errMsg: "格式不正确！"
							};
						}
					} catch(err) {
						return {
							result: false,
							errMsg: "正则表达式非法！"
						};
					}
					break;
				case 'max':
					if(val.length > +tmp[1]) {
						return {
							result: false,
							errMsg: "字符个数不能大于" + tmp[1] + "位！"
						};
					}
					break;
				case 'min':
					if(val.length < +tmp[1]) {
						return {
							result: false,
							errMsg: "字符个数不能小于" + tmp[1] + "位！"
						};
					}
					break;
			}
		}
		return {
			result: true
		};
	},
	// 判空
	isNull: function(arg) {
		return(arg === "" || arg === undefined || arg === null);
	},
	// 删除前后的空字符
	trim: function(arg) {
		if(this.isNull(arg))
			return false;
		return String.prototype.replace.call(arg, /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	},
	// 判断是否数字
	isDigits: function(arg) {
		if(this.isNull(arg))
			return false;
		return Number(arg) == 0 || !!Number(arg);
	},
	// 判断是否大于零的数字
	isPosDigits: function(arg) {
		return !!Number(arg) && (Number(arg) > 0);
	},
	// 判断整数
	isInteger: function(arg) {
		arg = this.trim(arg);
		return arg && /^[+-]?\s*\d+$/.test(arg);
	},
	// 判断是否正整数
	isPosInteger: function(arg) {
		arg = this.trim(arg);
		return arg && /^[+]?\s*[1-9]\d*$/.test(arg);
	},
	// 判断精度
	isPrecision: function(num, precision) {
		var reg = new RegExp('^[+-]?(0[.]\\d{' + precision + '}$|[1-9]\\d*[.]\\d{' + precision + '}$)');
		num = this.trim(num);
		return num && reg.test(num);
	},
	// 判断是否大于
	isMoreThan: function(target, base) {
		return Number(target) - Number(base) > Math.pow(10, -6);
	},
	// 判断是否小于
	isLessThan: function(target, base) {
		return Number(base) - Number(target) > Math.pow(10, -6);
	}
};
