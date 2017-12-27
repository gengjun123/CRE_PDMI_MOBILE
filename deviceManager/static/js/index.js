var pageData;
var isSelectedValue;
var num;
var wholeUrl='http://192.168.8.189:8080/deviceManagerAPI';
var Index=function() {
	return {
		init:function() {
			wholeUrl=Index.get_cookie("DEVICE_MANAGER_API");
			pageData={};
			Index.adjust();
			Index.loadListData();
			Index.showModule();
			Index.onceEvent();
		},
		adjust:function() {
			var winHeight = $(window).height();
			var winWidth = $(window).width();
			$(".containerDiv").css("height", winHeight * 0.96 + "px");
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
		adjustModule:function() {
			var winHeight = $(window).height();
			var winWidth = $(window).width();
			$(".progressBar").css("left",(winWidth-925)*0.56+"px");
			$(".progressBar").css("top",(winHeight-645)*0.4+"px");
		},
		showModule:function() {
			$(".lend").click(function() {
				window.sessionStorage.clear();
				var checkedId=$(this).val();
				var checkedName=pageData[checkedId].name;
				var checkedCode=pageData[checkedId].code;
				var checkedImportTime=pageData[checkedId].importTime;
				window.sessionStorage.setItem("deviceId",checkedId);
				window.sessionStorage.setItem("lendName",checkedName);
				window.sessionStorage.setItem("lendCode",checkedCode);
				window.sessionStorage.setItem("lendImportTime",checkedImportTime);
				window.lendIfram.Lend.loadInitData();
				$("#background,#lendProgressBar").show();
				Index.adjustModule();
			})
			$(".return").click(function() {
				window.sessionStorage.clear();
				var checkedId=$(this).val();
				var checkedName=pageData[checkedId].name;
				var checkedCode=pageData[checkedId].code;
				var checkedBorrowerName=pageData[checkedId].latestBorrowRecord.borrowerName;
				var checkedBorrowerPhone=pageData[checkedId].latestBorrowRecord.borrowerPhone;
				var checkedBorrowTime=pageData[checkedId].latestBorrowRecord.borrowTime;
				window.sessionStorage.setItem("deviceId",checkedId);
				window.sessionStorage.setItem("returnName",checkedName);
				window.sessionStorage.setItem("returnCode",checkedCode);
				window.sessionStorage.setItem("returnBorrowerName",checkedBorrowerName);
				window.sessionStorage.setItem("returnBorrowerPhone",checkedBorrowerPhone);
				window.sessionStorage.setItem("returnBorrowTime",checkedBorrowTime);
				window.returnIfram.Return.loadInitData();
				$("#background,#returnProgressBar").show();
				Index.adjustModule();
			})
			$(".deviceName").click(function() {
				window.sessionStorage.clear();
				var checkedId=$(this).attr("value");
				window.sessionStorage.setItem("deviceId",checkedId);
				/*window.open();*/
				Index.openWin("static/details.html");
			})
			$(".delete").click(function() {
				$('#titleModule').modal('show');
				window.sessionStorage.clear();
				var checkedId=$(this).attr("value");
				window.sessionStorage.setItem("checkedId",checkedId);
			})
			$(".scrap").click(function() {
				$('#titleModuleScrap').modal('show');
				window.sessionStorage.clear();
				var checkedId=$(this).attr("value");
				window.sessionStorage.setItem("checkedId",checkedId);
			})
			$(".pageChecked").click(function() {
				var searchData=Index.getSearchData();
				var searchInputDeviceName=searchData.searchInputDeviceName;
				var newChangedValue=searchData.newChangedValue;
				var searchInputBorrowerName=searchData.searchInputBorrowerName;
				
				var newValue=$(this).attr("value");
				$(".pageChecked").css("color","#888");
				if(newValue!="nextPage"&&newValue!="lastPage") {
					$(".pageChecked[value="+newValue+"]").css("color","#C9302C");
					isSelectedValue=newValue;
					Index.loadListData(searchInputDeviceName,searchInputBorrowerName,(parseInt(isSelectedValue)-1)*5,5,newChangedValue);
					Index.showModule();
				}else {
					if(newValue=="nextPage") {
						var newSelectedValue=parseInt(isSelectedValue)+1;
						$(".pageChecked[value="+newSelectedValue+"]").css("color","#C9302C");
						isSelectedValue=newSelectedValue;
						Index.loadListData(searchInputDeviceName,searchInputBorrowerName,(parseInt(isSelectedValue)-1)*5,5,newChangedValue);
						Index.showModule();
					}
					if(newValue=="lastPage") {
						var newSelectedValue=parseInt(isSelectedValue)-1;
						$(".pageChecked[value="+newSelectedValue+"]").css("color","#C9302C");
						isSelectedValue=newSelectedValue;
						Index.loadListData(searchInputDeviceName,searchInputBorrowerName,(parseInt(isSelectedValue)-1)*5,5,newChangedValue);
						Index.showModule();
					}
				}
				/*alert(newValue);*/
				
			})
			$("#toPageBtn").click(function() {
				Index.toPageFun();
			});
			$("#toPage").bind("keypress",function(event) {
				if(event.keyCode==13) {
					Index.toPageFun();
				}
			})
			
		},
		toPageFun:function() {
			var searchData=Index.getSearchData();
			var searchInputDeviceName=searchData.searchInputDeviceName;
			var newChangedValue=searchData.newChangedValue;
			var searchInputBorrowerName=searchData.searchInputBorrowerName;
			
			var toPageNum=$("#toPage").val();
			$("#toPage").val("");
			if(Index.isPositiveInteger(toPageNum)) {
				$(".pageChecked").css("color","#888");
				$(".pageChecked[value="+toPageNum+"]").css("color","#C9302C");
				isSelectedValue=toPageNum;
				Index.loadListData(searchInputDeviceName,searchInputBorrowerName,(parseInt(isSelectedValue)-1)*5,5,newChangedValue);
				Index.showModule();
			}
		},
		isPositiveInteger:function(s){
		    var re = /^[0-9]+$/ ;
		    return (re.test(s))&&(s<num+1)&&(s>0);
		},   
		openWin:function(url) {
			var winObj = window.open(url);  
			var loop = setInterval(function() {       
			    if(winObj.closed) {      
					location.reload();
			    }      
			}, 1);  
		},
		alertTime:function(flag) {
			if(flag) {
				$(".alertTitle").html("删除成功").show(300).delay(2000).hide(300);
			}else {
				$(".alertTitle").html("删除失败").show(300).delay(2000).hide(300);
			}
			
		},
		alertTimeScrap:function(flag) {
			if(flag) {
				$(".alertTitle").html("报废成功").show(300).delay(2000).hide(300);
			}else {
				$(".alertTitle").html("报废失败").show(300).delay(2000).hide(300);
			}
		},
		loadListData:function(name,borrowerName,start,limit,status) {
			Index.pageSelectFun(name,borrowerName,start,limit,status);
		},
		pageSelectFun:function(name,borrowerName,start,limit,status) {
			
			var pageSelectFunUrl=wholeUrl+'/devices?';
			if(name!=null) {
				pageSelectFunUrl+='name='+name+'&';
			}
			if(borrowerName!=null) {
				pageSelectFunUrl+='borrowerName='+borrowerName+'&';
			}
			if(start!=null) {
				pageSelectFunUrl+='start='+start+'&';
			}else {
				start=0;
				pageSelectFunUrl+='start=0&';
			}
			if(limit!=null) {
				pageSelectFunUrl+='limit='+limit+'&';
			}else {
				limit=5;
				pageSelectFunUrl+='limit=5&';
			}
			if(status!=null) {
				pageSelectFunUrl+='status='+status+'&';
			}
			$.ajax({
			   type: "GET",
			   async:false,
			   url: pageSelectFunUrl,
			   success: function(data){
			   	var totalHtml='';
			    var length=data.deviceList.length;
			    
			     if(length!=0) {
			     	for(var i=0;i<length;i++) {
			     		var tempData=data.deviceList[i];
			     		var tempState=tempData.status;
			     		var tempRecord= tempData.latestBorrowRecord;
			     		var btns1='<ul class="btnUl"><li class="btnLi"><button type="button" value="'+tempData.id+'" class="btn btn-default btn-sm lend">出借</button></li>'+
								'<li class="btnLi"><button type="button" value="'+tempData.id+'" class="btn btn-default btn-sm scrap">报废</button></li>'+
								'<li class="btnLi"><button type="button" value="'+tempData.id+'" class="btn btn-default btn-sm delete">删除</button></li></ul>';
						var btns2='<ul class="btnUl"><li class="btnLi"><button type="button" value="'+tempData.id+'" class="btn btn-default btn-sm return">归还</button></li></ul>';
						var btns3='<ul class="btnUl"><li class="btnLi"><button type="button" value="'+tempData.id+'" class="btn btn-default btn-sm delete">删除</button></li></ul>';
						pageData[tempData.id]=tempData;
						
			     		var tempButtons=btns1;
			     		if(tempState=='IN_STOCK') {
			     			tempState='在库';
			     		}
			     		if(tempState=='BORROWED') {
			     			tempState='借出';
			     			tempButtons=btns2;
			     		}
			     		if(tempState=='SCRAPPED') {
			     			tempState='报废';
			     			tempButtons=btns3;
			     		}
			     		totalHtml+='<tr><td><span value="'+tempData.id+'" class="deviceName">'+((tempData.name==null)?" ":(tempData.name))+'</span></td>';
			     		totalHtml+='<td>'+tempState+'</td>';
			     		totalHtml+='<td>'+((tempRecord==null)?" ":(tempRecord.borrowerName+'/'+tempRecord.borrowerPhone))+'</td>';
			     		totalHtml+='<td>'+((tempData.latestBorrowRecord==null)?" ":Index.formatDate(tempData.latestBorrowRecord.timeToReturn))+'</td>';
			     		totalHtml+='<td>'+tempButtons+'</td><td class="idTd">'+tempData.id+'</td></tr>';
			     	}
			     }
			     totalHtml+='<tr><td></td><td></td><td></td><td></td><td></td></tr>';
			     $("#listTabledata").html(totalHtml);
			     var total=data.total;
			     num=Math.ceil(parseFloat(total/limit));
			     if(num==0)num=1;
			     isSelectedValue=(start/limit)+1;
			     Index.createPage(num,isSelectedValue);
			   }
			});
		},
		formatDate:function(oldTime) {
			Date.prototype.toLocaleString=function() {
				return this.getFullYear() + "/" + (this.getMonth() + 1) + "/" + this.getDate()+ " " + this.getHours() + ":" + this.getMinutes();
			}
			var newTime = new Date(oldTime).toLocaleString();
			return newTime;
		},
		updataLoad:function() {
			Index.loadListData();
			Index.showModule();
		},
		createPage:function(num,isSelectedValue) {
			var startPageNum=Index.getStartPageNum(num,isSelectedValue);
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
					pageHtml+='<li><a href="#" class="dots" value="dots">...</a></li>';
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
		onceEvent:function() {
			$("#modalA").click(function() {
				$("#background,#putInStorageProgressBar").show();
				Index.adjustModule();
			})
			$(".moduleBtn").click(function() {
				$('#titleModule').modal('hide');
				var checkedId=window.sessionStorage.getItem("checkedId");
				$.ajax({
					type:"DELETE",
					url:wholeUrl+"/devices/"+checkedId,
					success:function(data) {
						
						/*location.reload(true);*/
						Index.alertTime(true);
						Index.updataLoad();
					},
					error:function(data) {
						Index.alertTime(false);
						Index.updataLoad();
					}
				});
			})
			$(".moduleBtnScrap").click(function() {
				$('#titleModuleScrap').modal('hide');
				var checkedId=window.sessionStorage.getItem("checkedId");
				$.ajax({
					type:"PUT",
					contentType: 'application/json;charset=UTF-8',
					url:wholeUrl+"/devices/"+checkedId,
					data:JSON.stringify({"status":"SCRAPPED"}),
					success:function(data) {
						
						/*location.reload(true);*/
						Index.alertTimeScrap(true);
						Index.updataLoad();
					},
					error:function(data) {
						Index.alertTimeScrap(false);
						Index.updataLoad();
					}
				});
			})
			$("#searchBtn,#pageChanged").click(function() {
				Index.searchEvent();
			})
			$("#searchInput").bind("keypress",function(event) {
				if(event.keyCode==13) {
					Index.searchEvent();
				}
			})
		},
		searchEvent:function() {
			var searchData=Index.getSearchData();
			var newChangedValue=searchData.newChangedValue;
			var searchInputBorrowerName=searchData.searchInputBorrowerName;
			var searchInputDeviceName=searchData.searchInputDeviceName;
			Index.pageSelectFun(searchInputDeviceName,searchInputBorrowerName,null,null,newChangedValue);
			Index.showModule();
		},
		getSearchData:function() {
			var searchType=$("#secrchSelect").val();
			var searchInput=$("#searchInput").val();
			if(searchInput=="") {
				searchInput=null;
			}
			var searchInputDeviceName=null;
			var searchInputBorrowerName=null;
			if(searchType=="deviceName") {
				searchInputDeviceName=searchInput;
			}
			if(searchType=="borrowerName") {
				searchInputBorrowerName=searchInput;
			}
			var newChangedValue=$("#pageChanged").val();
			if("ALLSTATE"==newChangedValue) {
				newChangedValue=null;
			}
			var arrSearchData={};
			arrSearchData['searchInputDeviceName']=searchInputDeviceName;
			arrSearchData['searchInputBorrowerName']=searchInputBorrowerName;
			arrSearchData['newChangedValue']=newChangedValue;
			return arrSearchData;
		}
	}
}();
$(Index.init());