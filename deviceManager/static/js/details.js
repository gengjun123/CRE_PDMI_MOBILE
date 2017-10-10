var pageData;
var isSelectedValue;
var num;
var wholeUrl="http://192.168.8.189:8080";
var Details=function() {
	return {
		init:function() {
			wholeUrl=Details.get_cookie("DEVICE_MANAGER");
			Details.begin();
			Details.loadData();
		},
		begin:function() {
			var winHeight = $(window).height();
			var winWidth = $(window).width();
			$(".container").css("height", winHeight * 0.97 + "px");
			
			
		},
		adjust:function() {
			var winHeight = $(window).height();
			var winWidth = $(window).width();
			$(".progressBar").css("left",(winWidth-925)*0.56+"px");
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
		loadData:function() {
			var deviceId=window.sessionStorage.getItem("deviceId");
			var url=wholeUrl+"/devices/"+deviceId;
			$.ajax({
			   type: "GET",
			   async:false,
			   url: url,
			   success: function(data){
			   	pageData=data;
			   	$(".deviceName").html(data.name);
			   	$("#deviceName").attr("value",data.name);
			   	$(".deviceCode").html(data.code);
			   	$("#deviceCode").attr("value",data.code);
			   	$(".deviceDescribe").html((data.description==null)?"":(data.description));
			   	$("#deviceDescribe").attr("value",(data.description==null)?"":(data.description));
			   	var importTime=Details.formatDate(data.importTime);
			   	$(".deviceImportTime").html(importTime);
			   	$(".deviceStatus").html(Details.getStatus(data.status));
			   	var buttonListHtml="";
			   	if(data.status=="IN_STOCK") {
			   		buttonListHtml+='<p class="font2 detailDelete">删除</p><p class="font2 detailScrap">报废</p><p class="font2 lend">出借</p><p class="font2 detailAlter">编辑</p>';
			   	}
			   	if(data.status=="BORROWED") {
			   		buttonListHtml+='<p class="font2 return">归还</p><p class="font2 detailAlter">编辑</p>';
			   	}
			   	if(data.status=="SCRAPPED") {
			   		buttonListHtml+='<p class="font2 detailDelete">删除</p>';
			   	}
			   	$(".buttonList").html(buttonListHtml);
			   	isSelectedValue=1;
			   	Details.createTable(1,0,2);
			   },
			   error:function(data) {
			   	alert("加载失败")
			   }
			})
			Details.showModule();
		},
		createTable:function(isSelectedValue,start,limit) {
			if(pageData.borrowRecordList!=null&&pageData.borrowRecordList.length!=0) {
				var currentPageData=new Array();
				var j=0;
				for(var i=start;(i<pageData.borrowRecordList.length)&&(i-start<limit);i++,j++){
					currentPageData[j]=pageData.borrowRecordList[i];
				}
				
				var total=pageData.borrowRecordList.length;
				var borrowRecordList=currentPageData;
				var totalHtml="";
				if(borrowRecordList!=null) {
					for(var i=0;i<borrowRecordList.length;i++){
						var tempData=borrowRecordList[i];
						totalHtml+='<tr><td>'+((tempData.borrowerName==null)?"":tempData.borrowerName)+'</td>';
				 		totalHtml+='<td>'+((tempData.borrowerPhone==null)?"":tempData.borrowerPhone)+'</td>';
				 		totalHtml+='<td>'+((tempData.borrowTime==null)?"":Details.formatDate(tempData.borrowTime))+'</td>';
				 		totalHtml+='<td>'+((tempData.timeToReturn==null)?"":Details.formatDate(tempData.timeToReturn))+'</td>';
				 		totalHtml+='<td>'+((tempData.timeReturned==null)?"":Details.formatDate(tempData.timeReturned))+'</td></tr>';
					}
				}
				totalHtml+='<tr><td></td><td></td><td></td><td></td><td></td></tr>';
				$("#detailsTbody").html(totalHtml);
				num=Math.ceil(parseFloat(total/limit));
				if(num==0)num=1;
				isSelectedValue=(start/limit)+1;
				Details.createPage(num,isSelectedValue);
				
			}else {
				Details.createPage(1,1);
			}
		},
		createPage:function(num,isSelectedValue) {
			var startPageNum=Details.getStartPageNum(num,isSelectedValue);
			var pageHtml='';
			if(num>6) {
				if(num-startPageNum>5) {
					pageHtml='<li><a href="#" class="pageChecked" id="lastPage" value="lastPage">&laquo;</a></li>';
					for(var i=startPageNum;i<startPageNum+4;i++) {
						if(i==startPageNum) {
							pageHtml+='<li><a href="#" class="pageChecked isFirst" value="'+i+'">'+i+'</a></li>';
						}else {
							pageHtml+='<li><a href="#" class="pageChecked" value="'+i+'">'+i+'</a></li>';
						}
					}
					pageHtml+='<li><a href="#" class="pageChecked" value="dots">...</a></li>';
					pageHtml+='<li><a href="#" class="pageChecked" value="'+num+'">'+num+'</a></li><li><a href="#" id="nextPage" class="pageChecked" value="nextPage">&raquo;</a></li>';
					pageHtml+='跳转&nbsp<li><input type="text" id="toPage"></li>&nbsp页';
					pageHtml+='<li id="toPageBtn">&nbsp&nbsp&nbsp&nbsp跳转</li>'
				}else {
					pageHtml='<li><a href="#" class="pageChecked" id="lastPage" value="lastPage">&laquo;</a></li>';
					for(var i=startPageNum;i<num;i++) {
						if(i==startPageNum) {
							pageHtml+='<li><a href="#" class="pageChecked isFirst" value="'+i+'">'+i+'</a></li>';
						}else {
							pageHtml+='<li><a href="#" class="pageChecked" value="'+i+'">'+i+'</a></li>';
						}
					}
					pageHtml+='<li><a href="#" class="pageChecked" value="'+num+'">'+num+'</a></li><li><a href="#" id="nextPage" class="pageChecked" value="nextPage">&raquo;</a></li>';
					pageHtml+='跳转&nbsp<li><input type="text" id="toPage"></li>&nbsp页';
					pageHtml+='<li id="toPageBtn">&nbsp&nbsp&nbsp&nbsp跳转</li>'
				}
			}else {
				pageHtml='<li><a href="#" class="pageChecked" id="lastPage" value="lastPage">&laquo;</a></li>';
				for(var i=1;i<num+1;i++) {
					if(i==startPageNum) {
						pageHtml+='<li><a href="#" class="pageChecked isFirst" value="'+i+'">'+i+'</a></li>';
					}else {
						pageHtml+='<li><a href="#" class="pageChecked" value="'+i+'">'+i+'</a></li>';
					}
					
				}
				pageHtml+='<li><a href="#" class="pageChecked" id="nextPage" value="nextPage">&raquo;</a></li>';
				pageHtml+='跳转&nbsp<li><input type="text" id="toPage"></li>&nbsp页';
				pageHtml+='<li id="toPageBtn">&nbsp&nbsp&nbsp&nbsp跳转</li>'
			}
			$(".pageSelectUl").html(pageHtml);
			$(".pageChecked").css("color","#888");
			$(".pageChecked[value="+isSelectedValue+"]").css("color","#C9302C");
			if(isSelectedValue==startPageNum){
				$("#lastPage").removeClass("pageChecked");
				$("#lastPage").css("cursor","not-allowed");
			};
			if(num==isSelectedValue) {
				$("#nextPage").removeClass("pageChecked");
				$("#nextPage").css("cursor","not-allowed");
			}
			Details.clickEvent();
		},
		getStartPageNum:function(num,isSelectedValue) {
			if(num<7||isSelectedValue<3) {
				return 1;
			}else {
				if(num-isSelectedValue>2) {
					return parseInt(isSelectedValue)-2;
				}else {
					return parseInt(num)-5;
				}
			}
		},
		formatDate:function(oldTime) {
			Date.prototype.toLocaleString=function() {
				return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate()+ " " + this.getHours() + ":" + this.getMinutes();
			}
			var newTime = new Date(oldTime).toLocaleString();
			return newTime;
		},
		getStatus:function(oldStatus) {
			if(oldStatus=="IN_STOCK") {
				return "在库";
			}
			if(oldStatus=="BORROWED") {
				return "借出";
			}
			if(oldStatus=="SCRAPPED") {
				return "报废";
			}
			return "";
		},
		showModule:function() {
			$(".detailAlter").click(function() {
				window.sessionStorage.clear();
				var checkedId=pageData.id;
				var checkedName=pageData.name;
				var checkedCode=pageData.code;
				var checkedDescription=pageData.description;
				window.sessionStorage.setItem("deviceId",checkedId);
				window.sessionStorage.setItem("deviceName",checkedName);
				window.sessionStorage.setItem("deviceCode",checkedCode);
				window.sessionStorage.setItem("deviceDescription",checkedDescription);
				window.putInStorageIframe.loadInitData();
				$("#background,#putInStorageProgressBar").show();
				Details.adjust();
			})
			$(".lend").click(function() {
				window.sessionStorage.clear();
				var checkedId=pageData.id;
				var checkedName=pageData.name;
				var checkedCode=pageData.code;
				window.sessionStorage.setItem("deviceId",checkedId);
				window.sessionStorage.setItem("lendName",checkedName);
				window.sessionStorage.setItem("lendCode",checkedCode);
				
				window.lendIfram.Lend.loadInitData();
				$("#background,#lendProgressBar").show();
				Details.adjust();
			})
			$(".return").click(function() {
				window.sessionStorage.clear();
				var checkedId=pageData.id;
				var checkedName=pageData.name;
				var checkedCode=pageData.code;
				var checkedBorrowerName=pageData.borrowRecordList[0].borrowerName;
				var checkedBorrowerPhone=pageData.borrowRecordList[0].borrowerPhone;
				window.sessionStorage.setItem("deviceId",checkedId);
				window.sessionStorage.setItem("returnName",checkedName);
				window.sessionStorage.setItem("returnCode",checkedCode);
				window.sessionStorage.setItem("returnBorrowerName",checkedBorrowerName);
				window.sessionStorage.setItem("returnBorrowerPhone",checkedBorrowerPhone);
				window.returnIfram.Return.loadInitData();
				$("#background,#returnProgressBar").show();
				Details.adjust();
			})
			$(".detailDelete").click(function() {
				$('#titleModule').modal('show');
			})
			$(".detailScrap").click(function() {
				$('#titleModuleScrap').modal('show');
			})
			$(".moduleBtn").click(function() {
				$('#titleModule').modal('hide');
				var checkedId=pageData.id;
				$.ajax({
					type:"DELETE",
					url:wholeUrl+"/devices/"+checkedId,
					success:function(data) {
						window.close();
					},
					error:function(data) {
						alert("删除失败")
					}
				});
			})
			$(".moduleBtnScrap").click(function() {
				$('#titleModuleScrap').modal('hide');
				var checkedId=pageData.id;
				$.ajax({
					type:"PUT",
					contentType: 'application/json;charset=UTF-8',
					url:wholeUrl+"/devices/"+checkedId,
					data:JSON.stringify({"status":"SCRAPPED"}),
					success:function(data) {
						location.reload(true);
					},
					error:function(data) {
						alert("报废操作失败");
					}
				});
			})
		},
		clickEvent:function() {
			$(".pageChecked").click(function() {
				var newValue=$(this).attr("value");
				$(".pageChecked").css("color","#888");
				if(newValue!="nextPage"&&newValue!="lastPage") {
					$(".pageChecked[value="+newValue+"]").css("color","#C9302C");
					isSelectedValue=newValue;
					newValue=parseInt(newValue);
					Details.createTable(newValue,(newValue-1)*2,2);
				}else {
					if(newValue=="nextPage") {
						var newSelectedValue=parseInt(isSelectedValue)+1;
						$(".pageChecked[value="+newSelectedValue+"]").css("color","#C9302C");
						isSelectedValue=newSelectedValue;
						isSelectedValue=parseInt(isSelectedValue);
						Details.createTable(isSelectedValue,(isSelectedValue-1)*2,2);
					}
					if(newValue=="lastPage") {
						var newSelectedValue=parseInt(isSelectedValue)-1;
						$(".pageChecked[value="+newSelectedValue+"]").css("color","#C9302C");
						isSelectedValue=newSelectedValue;
						isSelectedValue=parseInt(isSelectedValue);
						Details.createTable(isSelectedValue,(isSelectedValue-1)*2,2);
					}
				}
			});
			$("#toPageBtn").click(function() {
				Details.toPageFun();
			});
			$("#toPage").bind("keypress",function(event) {
				if(event.keyCode==13) {
					Details.toPageFun();
				}
			})
		},
		toPageFun:function() {
			var toPageNum=$("#toPage").val();
			$("#toPage").val("");
			if(Details.isPositiveInteger(toPageNum)) {
				$(".pageChecked").css("color","#888");
				$(".pageChecked[value="+toPageNum+"]").css("color","#C9302C");
				isSelectedValue=toPageNum;
				Details.createTable(isSelectedValue,(isSelectedValue-1)*2,2);
				Details.showModule();
			}
		},
		isPositiveInteger:function(s){
		    var re = /^[0-9]+$/ ;
		    return (re.test(s))&&(s<num+1)&&(s>0);
		}
	}
}();
$(Details.init());
