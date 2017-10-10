var wholeUrl="http://192.168.8.189:8080";
var PutInStorage=function() {
	return {
		init:function() {
			wholeUrl=PutInStorage.get_cookie("DEVICE_MANAGER");
			PutInStorage.bindEvent();
		},
		bindEvent:function() {
			$(".form_datetime").datetimepicker({
			    /*minView: "month",*/ //选择日期后，不会再跳转去选择时分秒  
				language:  'zh-CN',
				format: 'yyyy/mm/dd hh:ii',
				todayBtn:  1,
				autoclose: 1,
				pickerPosition: "bottom-left"
			});
			$(".btnCancel,.modulClose").click(function() {
				PutInStorage.closeFun();
			});
			$("#putInStorageOk").click(function(){
			 if(PutInStorage.validform().form()) {
			  var oldValue=$("#dtp_input2").attr("value");
				oldValue+=":00";
				var newValue=new Date(oldValue).getTime();
				$("#putInStorageDate").attr("value",newValue)
				PutInStorage.formSubmit();
			 } else {
			  //校验不通过，什么都不用做，校验信息已经正常显示在表单上
			 }
			});
			var nowTime=PutInStorage.getNowFormatDate();
			$("#putInStorageDateInput").val(nowTime);
			$("#dtp_input2").attr("value",nowTime);
		},
		get_cookie:function(Name) {
		   var search = Name + "="//查询检索的值
		   var returnvalue = "";//返回值
		   if (document.cookie.length > 0) {
		     sd = document.cookie.indexOf(search);
		     if (sd!= -1) {
		        sd += search.length;
		        end = document.cookie.indexOf(";", sd);
		        if (end == -1)
		         end = document.cookie.length;
		         //unescape() 函数可对通过 escape() 编码的字符串进行解码。
		        returnvalue=unescape(document.cookie.substring(sd, end))
		      }
		   } 
		   return returnvalue;
		},
		formSubmit:function() {
			var name=$("#firstname").val();
			var code=$("#firstcode").val();
			var importTime=$("#putInStorageDate").val();
			var description=$("#description").val();
			var data={"name":name,"code":code,"importTime":importTime,"description":description};
			var url=wholeUrl+"/devices";
			$.ajax({
				type: "POST",
				contentType: 'application/json;charset=UTF-8',
				url:url,
				data:JSON.stringify(data),
				success:function(returnData1){
					PutInStorage.closeFun();
				},
				error:function(returnData2){
					PutInStorage.closeFun();
				}
			})
		},
		getNowFormatDate:function() {
		    var date = new Date();
		    var seperator1 = "-";
		    var seperator2 = ":";
		    var month = date.getMonth() + 1;
		    var strDate = date.getDate();
		    if (month >= 1 && month <= 9) {
		        month = "0" + month;
		    }
		    if (strDate >= 0 && strDate <= 9) {
		        strDate = "0" + strDate;
		    }
		    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
		            + " " + date.getHours() + seperator2 + date.getMinutes();
		    return currentdate;
		},
		closeFun:function() {
			$("#background,#putInStorageProgressBar",window.parent.document).css("display","none");
			parent.Common.reload();
		},
		//编写表单验证函数validform，在验证按钮注册按钮点击事件内调用验证函数对象
		validform:function(){
		 /*关键在此增加了一个return，返回的是一个validate对象，这个对象有一个form方法，返回的是是否通过验证*/
		 return $("#putInStorageFrom").validate({
		  rules : {
		   name : {
		    required : true
		   },
		   code:{
		   	required : true
		   }
		  },
		  messages : {
		   name : {
		    required : '设备名称为必填项',
		   },
		   code : {
		    required : '条码为必填项',
		   },
		  },
		  errorElement: "label", //用来创建错误提示信息标签
			success: function(label) { //验证成功后的执行的回调函数
				//label指向上面那个错误提示信息标签label
				label.text(" "); //清空错误提示消息
			}
		 });
		}
	}
}();
$(PutInStorage.init());
