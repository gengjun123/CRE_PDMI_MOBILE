var wholeUrl="http://192.168.8.189:8080/deviceManagerAPI";
var lendImportTime;
var submitFlag1=true;
var submitFlag2=true;
var submitFlag3=true;
var Lend=function() {
	return {
		init:function() {
			wholeUrl=Lend.get_cookie("DEVICE_MANAGER_API");
			/*Lend.loadInitData();*/
			Lend.begin();
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
		begin:function() {
			$(".form_datetime").datetimepicker({
			    /*minView: "day",*/ //选择日期后，不会再跳转去选择时分秒 
				language:  'zh-CN',
				format: 'yyyy-mm-dd hh:ii',
				todayBtn:  1,
				autoclose: 1,
				pickerPosition: "bottom-left"
			});
			$(".btnCancel,.modulClose").click(function() {
				$("#background,#lendProgressBar",window.parent.document).css("display","none");
				parent.Common.reload();
			});
			$("#lendOk").click(function() {
				var flag1=$("#select_auditor").val()!=null&&$("#select_auditor").val()!="";
				if(flag1&&submitFlag1&&submitFlag2&&submitFlag3) {
					if(Lend.validform().form()) {
						var oldValue2=$("#dtp_input2").attr("value");
						var oldValue3=$("#dtp_input3").attr("value");
						oldValue2+=":00";
						oldValue3+=":00";
						var newValue2=new Date(oldValue2).getTime();
						var newValue3=new Date(oldValue3).getTime();
						$("#borrowTime").attr("value",newValue2);
						$("#timeToReturn").attr("value",newValue3);
						Lend.submitFrom();
					}else {
					}
				}else {
					if(!flag1) {$("#borrowerName-error").show()};
				}
				
			});
			$("#select_auditor").change(function() {
				if($("#select_auditor").val()!=null&&$("#select_auditor").val()!="") {
					$("#borrowerName-error").hide();
					submitFlag1=true;
				}else {
					$("#borrowerName-error").show();
					submitFlag1=false;
				}
			});
			$("#predictReturnTime").change(function() {
				var tempLendTime=$("#dtp_input2").val()+":00";
				var tempReturnTime=$("#dtp_input3").val()+":00";
				if((new Date(tempReturnTime).getTime())<(new Date(tempLendTime).getTime())) {
					$("#returnTime-error").show();
					submitFlag2=false;
				}else {
					$("#returnTime-error").hide();
					submitFlag2=true;
				}
			});
			$("#lendTimeDiv").change(function() {
				var putInStoreTime=parseInt(lendImportTime);
				var lendTime=$("#dtp_input2").val()+":00";
				if((new Date(putInStoreTime).getTime())>(new Date(lendTime).getTime())) {
					$("#borrowerTime-error").show();
					submitFlag3=false;
				}else {
					$("#borrowerTime-error").hide();
					submitFlag3=true;
				}
			});
			Lend.loadUserData();
		},
		loadUserData:function() {
			var wholeUrl2="http://192.168.8.241/cre/api/authorization/users";
			wholeUrl2=Lend.get_cookie("CRE");
			$.ajax({
				type:"GET",
				url:wholeUrl2,
				async:true,
				success:function(data) {
					var userList=data.userList;
					var select2Data = [{id:"",text:""}];
					for(var i=0;i<userList.length;i++) {
						var Uid=userList[i].id;
						var Uname=userList[i].name;
						var map={};
						map["id"]=Uid;
						map["text"]=Uname;
						select2Data.push(map);
					}
					$("#select_auditor").select2({
						placeholder: "请选择",
						language: 'zh-CN',
						theme: 'bootstrap',
						data:select2Data
					});
				}
			});
		},
		getNowFormatDate:function(paramDate) {
			var date;
			if(paramDate!=null) {
				date = new Date(paramDate);
			}else {
				date=new Date();
			}
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
		submitFrom:function() {
			var deviceId=$("#lendId").val();
			var borrowerName=$("#select_auditor").select2("data")[0].text;
			var borrowerId=$("#select_auditor").select2("data")[0].id;
			var borrowerPhone=$("#borrowerPhone").val();
			var borrowTime=$("#borrowTime").val();
			var timeToReturn=$("#timeToReturn").val();
			var data={"borrowerName":borrowerName,"borrowerId":borrowerId,"borrowerPhone":borrowerPhone,"borrowTime":borrowTime};
			if(timeToReturn!="946656000000") {
				data["timeToReturn"]=timeToReturn;
			}
			var url=wholeUrl+"/devices/"+deviceId+"/borrowRecords";
			$.ajax({
				type: "POST",
				contentType: 'application/json;charset=UTF-8',
				url:url,
				data:JSON.stringify(data),
				success:function(returnData1){
					Lend.closeFun();
				},
				error:function(returnData2){
					Lend.closeFun();
				}
			})
			
		},
		loadInitData:function() {
			var lendId=window.sessionStorage.getItem("deviceId");
			var lendName=window.sessionStorage.getItem("lendName");
			var lendCode=window.sessionStorage.getItem("lendCode");
			lendImportTime=window.sessionStorage.getItem("lendImportTime");
			lendImportTime=parseInt(lendImportTime);
			$(".fontName").html(lendName);
			$(".fontCode").html(lendCode);
			$("#lendId").attr("value",lendId);
			var nowTimeDate=new Date().getTime();
			var nowTime=Lend.getNowFormatDate(lendImportTime>nowTimeDate?lendImportTime:nowTimeDate);
			$("#dtp_input2input").val(nowTime);
			$("#dtp_input2").attr("value",nowTime);
		},
		closeFun:function() {
			$("#background,#lendProgressBar",window.parent.document).css("display","none");
			parent.Common.reload();
		},
		validform:function(){
		 /*关键在此增加了一个return，返回的是一个validate对象，这个对象有一个form方法，返回的是是否通过验证*/
		 return $("#lendForm").validate({
		  rules : {
		   borrowerName : {
		    required : true
		   },
		   borrowerPhone:{
		   	digits:true,
			minlength:6,
			maxlength:11
		   }
		  },
		  messages : {
		   borrowerName : {
		    required : '借出人姓名为必填项',
		   },
		   borrowerPhone : {
		    digits:'请输入正确的电话格式',
			minlength:'借出人电话不能少于6位',
			maxlength:'借出人电话不能超过11位'
		   }
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
$(Lend.init());
