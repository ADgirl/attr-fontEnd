(function(w) {
	if (!w.Svc)
		w.Svc = {};
	// loading等待提示框
	Svc.loading = _waiting = function(tips) {
		var self = this;
		self.divLoadingProgressCover = null;
		self.divLoadingProgressWaiting = null;

		self._createDiv = function() {

			if (self.divLoadingProgressCover != null
					&& self.divLoadingProgressWaiting != null)
				return;
			// 调用比较频繁的时候，遮罩层太闪眼睛，变成全透明的
			// 遮盖层
			self.divLoadingProgressCover = $('<div/>').attr('id',
					"divLoadingProgressCover").css({
				"display" : "none",
				"background" : "gray",
				"position" : "absolute",
				"left" : "0px",
				"top" : "0px",
				"width" : $(document).width() + 'px',
				"height" : $(document).height() + 'px',
				"z-index" : "9999",
				"filter" : "alpha(opacity=0)",
				"-moz-opacity" : "0.0",
				"opacity" : "0.0"
			});
			if (self.divLoadingProgressCover != null)
				$(document.body).append(self.divLoadingProgressCover);

			// 提示信息
			self.divLoadingProgressWaiting = $('<div/>').attr('id',
					"divLoadingProgressWaiting").css({
				"display" : "none",
				'color' : 'white',
				'padding' : '5px',
				"position" : "absolute",
				"background" : "#0099ff",
				"right" : "0px",
				"z-index" : "9999",
				"top" : "0px"
			}).append(tips);
			if (self.divLoadingProgressWaiting != null)
				$(document.body).append(self.divLoadingProgressWaiting);
		};
		self.show = function() {
			self._createDiv();
			self.divLoadingProgressWaiting.show();
			self.divLoadingProgressCover.show();
		};
		self.close = function() {
			if (self.divLoadingProgressCover != null)
				self.divLoadingProgressCover.hide().remove();
			if (self.divLoadingProgressWaiting != null)
				self.divLoadingProgressWaiting.hide().remove();
			self.divLoadingProgressCover = null;
			self.divLoadingProgressWaiting = null;

		};
	};

	var AJAX_LOADING = new Svc.loading("");

	var callback = function(msg, fnCallback, failure) {
		// msg.successful && !msg.data.authCheckCode
		if (msg.respCode == '200') {
			fnCallback && fnCallback(msg.data);
		} else {
			if (msg.code && msg.code == "emm.noLogin") {
				top.alert('您当前还未登录，点击确定登录！');
				top.location.href = Svc.rootPath() + "/login.do";
			} else if (msg.code && msg.code == "emm.noMobileLogin") {
				alert('您当前还未登录，点击确定登录！');
				location.href = Svc.rootPath() + "/mobile/login.do";
			}
			failure && failure(msg.data);
		}
	};

	/**
	 * jquery ajax方法封装
	 */
	var call = function(ajaxType, _url, _param, _success, method, refBy, async,
			failure, isShowTips) {

		var setting = {};

		if (method)
			setting.type = method;
		else
			setting.type = 'POST';

		setting.url = _url;

		if (ajaxType == 'json') {
			setting.data = _param && JSON.stringify(_param);
			setting.contentType = 'application/json;charset=UTF-8';
			setting.dataType = 'json';
		} else if (ajaxType == 'form') {
			setting.contentType = 'application/x-www-form-urlencoded; charset=UTF-8';
			setting.data = _param;
			setting.traditional = true;// 采用传统方法序列号
		} else if (ajaxType == 'page') {
			setting.dataType = 'html';
		}

		setting.beforeSend = function(xhr) {
			if (refBy) {
				if ((typeof refBy) === 'string')
					xhr.setRequestHeader('functionReferBy', refBy);
				else
					xhr.setRequestHeader('functionReferBy', JSON
							.stringify(refBy));
			}
			// 判断是否需要显示遮罩，未传值或者true->显示，false和不正确参数->不显示
			if ((isShowTips == null) || (isShowTips == undefined)
					|| (isShowTips === true)) {
				AJAX_LOADING.show();
			}

		};

		setting.complete = function(XMLHttpRequest, textStatus) {
			// 判断是否需要显示遮罩，未传值或者true->显示，false和不正确参数->不显示
			if ((isShowTips == null) || (isShowTips == undefined)
					|| (isShowTips === true)) {
				AJAX_LOADING.close();
			}
		};

		setting.error = function(xhr, textStatus, errorThrown) {
			// 判断是否需要显示遮罩，未传值或者true->显示，false和不正确参数->不显示
			if ((isShowTips == null) || (isShowTips == undefined)
					|| (isShowTips === true)) {
				AJAX_LOADING.close();
			}
			// 服务停止后发送请求不弹框提示
			// xhr.readyState != 0 防止页面切换太快及Firefox、Chrome下服务停止后发送请求弹出对话框
			// xhr.readyState != 4 防止IE下服务停止后发送请求弹出对话框
			/*
			 * if (xhr.status != 200 && xhr.readyState != 0 && xhr.readyState !=
			 * 4) { // 防止页面切换太快及服务停止时弹出对话框 Svc.Exception.show(xhr.status,
			 * xhr.readyState + "," + xhr.status + "," + textStatus); }
			 */
		};

		setting.success = function(msg) {
			// 判断是否需要显示遮罩，未传值或者true->显示，false和不正确参数->不显示
			if ((isShowTips == null) || (isShowTips == undefined)
					|| (isShowTips === true)) {
				AJAX_LOADING.close();
			}

			if (ajaxType == 'page') {
				_success && _success(msg);
			} else
				callback(msg, _success, failure);
		};

		if (async != undefined) {
			setting.async = async;
		}

		setting.cache = false;

		$.ajax(setting);
	};
	/**
	 * json数据的ajax调用后台方法
	 */
	/**
	 * 
	 * url: 访问的url param： 参数（json格式） callback： 回调函数
	 */
	Svc.AjaxJson = function() {

		var _get = function(_url, _param, _success, refBy, async) {
			call('json', _url, _param, _success, 'GET', refBy, async);
		};

		var _post = function(_url, _param, _success, refBy, async) {
			call('json', _url, _param, _success, 'POST', refBy, async);
		};

		var _sGet = function(_url, _param, _success, refBy) {
			_get(_url, _param, _success, refBy, false);
		};

		var _sPost = function(_url, _param, _success, refBy) {
			_post(_url, _param, _success, refBy, false);
		};

		return {
			get : _get,
			post : _post,
			sGet : _sGet,
			sPost : _sPost
		};

	}();

	Svc.ajax = function(cfg) {
		var deconf = {
			method : 'POST',
			dataType : "json",
			asyn : true
		};
		$.extend(deconf, cfg);

		call(deconf.dataType, deconf.url, deconf.param, deconf.success,
				deconf.method.toUpperCase(), deconf.refBy, deconf.asyn,
				deconf.failure);
	};

	/**
	 * FORM表单数据的ajax提交
	 */
	Svc.AjaxForm = function() {

		var _get = function(_url, _param, _success, refBy, async) {
			call('form', _url, _param, _success, 'GET', refBy, async);
		};

		var _post = function(_url, _param, _success, refBy, async) {
			call('form', _url, _param, _success, 'POST', refBy, async);
		};

		var _sGet = function(_url, _param, _success, refBy) {
			_get(_url, _param, _success, refBy, false);
		};

		var _sPost = function(_url, _param, _success, refBy) {
			_post(_url, _param, _success, refBy, false);
		};
		/**
		 * 直接传入表单的form 的jquery对象来提交哦，例如 : send( $('#testForm'), callback)
		 */
		var _send = function(formObj, _success, refBy) {
			var p = formObj.serialize();
			var url = formObj.attr('action');
			var method = formObj.attr('method');
			call('form', url, p, _success, method, refBy);
		};

		return {
			get : _get,
			post : _post,
			send : _send,
			sGet : _sGet,
			sPost : _sPost
		};
	}();

	/**
	 * 表单数据转换为json
	 */
	Svc.formToJson = function(formObj, needKey) {
		var o = {};
		var a = formObj.serializeArray();
		$.each(a,
				function() {
					if (this.value || needKey) {
						if (o[this.name]) {
							if (!o[this.name].push) {
								o[this.name] = [ o[this.name] ];
							}
							o[this.name].push(this.value || null);
						} else {
							if ($("[name='" + this.name + "']:checkbox",
									formObj).length) {
								o[this.name] = [ this.value ];
							} else {
								o[this.name] = this.value || null;
							}
						}
					}
				});
		return o;
	};

	/**
	 * JSON数据绑定表单
	 */
	Svc.jsonToDom = function(data, container, expression, callbacks) {
		
		var dispose = {// 根据不同的类型做出相应处理
			INPUTradio : function(dom, val) {
				dom.removeAttr("checked");
				if (dom.val() == val){
					dom[0].checked=true;
					dom.attr("checked", "checked");
				}
					
			},
			INPUTcheckbox : function(dom, vals) {
				var array = [];
				if (Object.prototype.toString.apply(vals) === "[object Array]") {
					array = vals;
				} else {
					array.push(vals);
				}
				for ( var i in array) {
					if (dom.val() == array[i])
						dom.attr("checked", "checked");
				}
			},
			INPUThidden : function(dom, val) {
				dom.val(val);
			},
			INPUTtext : function(dom, val) {
				dom.val(val);
			},
			INPUTnumber : function(dom, val) {
				dom.val(val);
			},
			INPUTpassword : function(dom, val) {
				dom.val(val);
			},
			TEXTAREAtextarea : function(dom, val) {
				dom.val(val);
			},
			LABEL : function(dom, val) {
				dom.text(val);
			},
			TEXTAREA : function(dom, val) {
				dom.text(val);
			},
			SELECT : function(dom, val) {
				dom.val(val);
			},
			"SELECTselect-one" : function(dom, val) {
				dom.val(val);
			},
			INPUTfile : function() {
			},
			FORM : function() {
			}// IE8，6 下会把FORM读出来;
		};

		if (!expression)
			expression = '[name]';

		var doms = $(expression, container);
		if (data) {
			$.each(doms, function(i) {
				
				var dom = doms.eq(i);
				var domName = dom.attr('name');
				if (data[domName] == null)
					data[domName] = "";
				var tagName = dom.get(0).tagName;

				var tagType = dom.attr("type");
				
				var type = tagType ? tagName + tagType : tagName;
				if (callbacks) {// 扩展处理的回调
					$.each(callbacks, function(i, callback) {
						if (callback(dom, data[domName], type) == false)// 有返回假就不不执行后面的处理
							return;
					});
				}
				dispose[type](dom, data[domName]);
				//这种情况出现在加了$("select").dropbox();  样式的情况
				if(tagName.toUpperCase()=='SELECT'){
					var curId = dom.get(0).id;
					if($($("#"+curId).next().get(0)).attr("class")=='dropbox-input'){
						var selectInput = $($("#"+curId).next().get(0)).find("input");
						var selectText = "";
						if(selectInput.length>0){
							$("#"+curId+" option").each(function (){  
								var id = $(this).val();
								if(id==data[domName]){
									selectText = $(this).text();
									return false;
								}
							});
							selectInput.val(selectText);
						}
					}
				}
				
			});
		}
		;
	};

	/**
	 * 重置表单
	 */
	Svc.resetForm = function(formObj) {
		if (formObj) {
			var resetInput = $("input[type='reset']", formObj);
			if (resetInput.length == 0) {// 找不到dom对象时返回长度为0的数组
				resetInput = $("<input type='reset' style='display:none;'/>");
				formObj.append(resetInput);
			}
			resetInput.trigger('click');// 执行浏览器默认表单重置行为

			$("textarea", formObj).empty();
			$("input[type='hidden']", formObj).val("");
		}
	};

	/**
	 * 查找URL后的参数
	 */
	Svc.queryString = function(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return (r[2]);
		return null;
	}
	/**
	 * 获取系统根路径
	 */
	Svc.rootPath = function() {
		var obj = window.location;
		//var contextPath = obj.pathname.split("/")[1];
		var rootPath = obj.protocol + "//" + obj.host + "/";
		return "";
	}

	/**
	 * 设置-获取-移除Cookie
	 */
	Svc.cookie = {};
	// 写入Cookie，key为键，value是值
	// duration过期时间（天为单位，默认1天）
	Svc.cookie.write = function(key, value, duration) {
		Svc.cookie.remove(key);
		var d = new Date();
		if (duration <= 0)
			duration = 1;
		d.setTime(d.getTime() + 1000 * 60 * 60 * 24 * duration);
		document.cookie = key + "=" + encodeURI(value) + "; expires="
				+ d.toGMTString() + ";path=/";
	};
	// 移除Cookie,key为键
	Svc.cookie.remove = function(key) {
		var d = new Date();
		if (Svc.cookie.read(key) != "") {
			d.setTime(d.getTime() - (86400 * 1000 * 1));
			document.cookie = key + "=;expires=" + d.toGMTString() + ";path=/";
		}
	};
	// 读取Cookie，key是键 不存在返回空字符串""
	Svc.cookie.read = function(key) {
		var arr = document.cookie.match(new RegExp("(^| )" + key
				+ "=([^;]*)(;|$)"));
		if (arr != null)
			return decodeURIComponent(arr[2]);
		return "";
	};

})(window);

// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// (new Date()).format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
Date.prototype.format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"H+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};

String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, '');
};