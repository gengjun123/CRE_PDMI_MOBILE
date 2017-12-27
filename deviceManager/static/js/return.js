var wholeUrl="http://192.168.8.189:8080/deviceManagerAPI";
var returnBorrowTime;
var submitFlag1=false;
var Return=function() {
	return {
		init:function() {
			wholeUrl=Return.get_cookie("DEVICE_MANAGER_API");
			Return.begin();
		},
		begin:function() {
			$(".form_datetime").datetimepicker({
			    /*minView: "month",*/ //选择日期后，不会再跳转去选择时分秒
				language:  'zh-CN',
				format: 'yyyy-mm-dd hh:ii',
				todayBtn:  1,
				autoclose: 1,
				pickerPosition: "bottom-left"
			});
			$(".btnCancel,.modulClose").click(function() {
				$("#background,#returnProgressBar",window.parent.document).css("display","none");
				parent.Common.reload();
			});
			$("#returnOk").click(function() {
				var flag1=$("#select_auditor").val()!=null&&$("#select_auditor").val()!="";
				if(flag1&&submitFlag1) {
					var oldValue2=$("#dtp_input2").attr("value");
					oldValue2+=":00";
					var newValue2=new Date(oldValue2).getTime();
					$("#timeReturned").attr("value",newValue2);
					Return.submitFrom();
				}else {
					if(!flag1) {$("#returnName-error").show()};
				}
			});
			$("#select_auditor").change(function() {
				if($("#select_auditor").val()!=null&&$("#select_auditor").val()!="") {
					$("#returnName-error").hide();
				}else {
					$("#returnName-error").show();
				}
			});
			$("#returnTime").change(function() {
				var returnTimeTemp=$("#dtp_input2input").val()+":00";
				if(new Date(returnTimeTemp).getTime()<returnBorrowTime) {
					$("#returnTime-error").show();
					submitFlag1=false;
				}else {
					$("#returnTime-error").hide();
					submitFlag1=true;
				}
			})
			Return.loadUserData();
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
		loadUserData:function() {
			var wholeUrl2="http://192.168.8.241/cre/api/authorization/users";
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
		submitFrom:function() {
			var returnId=$("#returnId").val();
			var returnerName=$("#select_auditor").select2("data")[0].text;
			var returnerId=$("#select_auditor").select2("data")[0].id;
			var timeReturned=$("#timeReturned").val();
			var data={"returnerName":returnerName,"returnerId":returnerId,"timeReturned":timeReturned};
				var url=wholeUrl+"/devices/"+returnId+"/borrowRecords";
				$.ajax({
					type: "PUT",
					contentType: 'application/json;charset=UTF-8',
					url:url,
					data:JSON.stringify(data),
					success:function(returnData1){
						Return.closeFun();
					},
					error:function(returnData2){
						Return.closeFun();
					}
				})
			
		},
		loadInitData:function() {
			var returnId=window.sessionStorage.getItem("deviceId");
			var returnName=window.sessionStorage.getItem("returnName");
			var returnCode=window.sessionStorage.getItem("returnCode");
			var returnBorrowerName=window.sessionStorage.getItem("returnBorrowerName");
			var returnBorrowerPhone=window.sessionStorage.getItem("returnBorrowerPhone");
			returnBorrowTime=window.sessionStorage.getItem("returnBorrowTime");
			returnBorrowTime=parseInt(returnBorrowTime);
			$(".fontName").html(returnName);
			$(".fontCode").html(returnCode);
			$(".fontBorrowerName").html(returnBorrowerName);
			$(".fontBorrowerPhone").html(returnBorrowerPhone);
			$("#returnId").attr("value",returnId);
			
			var nowTimeDate=new Date().getTime();
			var nowTime=Return.getNowFormatDate(returnBorrowTime>nowTimeDate?returnBorrowTime:nowTimeDate);
			$("#dtp_input2input").val(nowTime);
			$("#dtp_input2").attr("value",nowTime);
		},
		closeFun:function() {
			$("#background,#returnProgressBar",window.parent.document).css("display","none");
			parent.Common.reload();
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
		}
	}
	
}();
$(Return.init());
