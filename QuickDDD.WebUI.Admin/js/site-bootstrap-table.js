/*******************************************************************************
 * 描述：bootstrap数据列表，PC端使用，依赖于bootstrap.js、bootstrap-table-all.js 
 * 作者：金鱼
 * 时间：2015-05-06
 ******************************************************************************/
var site = site || {};
(function() {
	site.table = function(selector, options) {
		var defaults = {
			classes : 'table bootstrap-table',  // 表格的样式名称
			height : 500, // 表格的高度
			undefinedText : '-', //定义默认的undefined显示文字（如果发现对应的data字段数据没有就显示'-'）
			sortName : undefined, // 定义哪一列可被排序
			sortOrder : 'asc', // 定义列排序的顺序，只能为“asc”和“desc”
			striped : true, // 使表格带有条纹
			columns : [], // 表格列的配置(如果发现数据列表中有thead，会相应的替换其属性)
			data : [], // 初始化数据(如果url不为空会去请求url数据)
			dataField: 'rows',
			method : 'POST', // 远程数据请求的方法
			url : undefined, // 远程数据请求的URL地址
			ajax : undefined, // 这是一个函数，会默认传入当前默认的url type success等等参数
			cache : true, // 设置False禁用AJAX请求的缓存
			contentType : 'application/x-www-form-urlencoded', // 远程数据请求的“contentType”类型
			dataType : 'json', // 远程数据请求返回的数据类型
			ajaxOptions : {}, // 默认jquery的ajax选项
			queryParams : function(params) {
				 // 远程数据请求时，可以通过queryParams来格式化所需要的数据信息，参数（对象）包含了：
				//pageSize, pageNumber, searchText, sortName, sortOrder。返回 false 可以禁用请求。
				return params;
			},
			queryParamsType : '', // 设置为“limit”可以发送标准的RESTFul类型的参数请求。
			responseHandler : function(res) {
				// 在加载数据前，可以对返回的数据进行处理，参数包含： res: 返回的数据。
				if(res.success === true){
					return {"total": res.result.pageCount,"rows":res.result.pageData};
				}
				return res;
			},
			pagination : true,  // 设置True在表格底部显示分页工具栏
			onlyInfoPagination: false, //分页信息显示内容 true: formatDetailPagination，false: formatShowingRows
			sidePagination : 'server', // 定义表格分页的位置，只能是“client”（客户端）和“server”（服务器端）
			totalRows : 0, // 总记录数
			pageNumber : 1, // 分页的时候设置当前的页码
			pageSize : 10, // 分页的时候设置每页的条数
			pageList : [10, 25, 50, 100 ], // 分页的时候设置分页数的列表
			paginationHAlign : 'right', // right, left 分页信息的水平位置
			paginationVAlign : 'bottom', // bottom, top, both 分页信息的上下位置
			paginationDetailHAlign : 'left', // right, left
			paginationFirstText : '首页', // 
			paginationPreText : '上页', // 
			paginationNextText : '下页', // 
			paginationLastText : '末页', // 
			search : true, // 启用搜索输入框
			searchAlign : 'right', // 定义搜索栏的对齐方式，只能为："left", "right"。
			selectItemName : 'btSelectItem', // 单选框或者复选框的name，用于多个表格使用radio的情况。
			showExport: false, // 设置是否显示导出工具栏
			showHeader : true, // 设置为False可隐藏表头
			showFooter : false, // 设置是否显示列表底部栏
			showColumns : true, // 设置为True可显示表格显示/隐藏列表 (可选列的显示或隐藏状态)
			showPaginationSwitch : true, // 显示/隐藏 底部分页信息栏(按钮)
			showRefresh : true, // 设置为True可显示刷新按钮
			showToggle : true, // 设置为True可显示切换普通表格和名片（card）布局(按钮)
			buttonsAlign : 'right', // 按钮布局
			smartDisplay : true, // 设置为True智能显示分页或者Card View
			minimumCountColumns : 1, // 表格显示/隐藏列表时可设置最小隐藏的列数。
			idField :  undefined, // 标识哪个字段为id主键
			uniqueId : undefined, // 
			cardView : false, // 设置为True时显示名片（card）布局，例如用手机浏览的时候。
			detailView : false, // 查看详细信息，对于下面detailFormatter数据信息
			detailFormatter : function(index, row) {
				 // 点开列表查看详细内容
				return '';
			},
			trimOnSearch : true, //是否去除关键词内容的左右空格
			clickToSelect : true, // 设置为True时点击行即可选中单选/复选框
			singleSelect : false, // 设置为True时复选框只能选择一条记录。
			toolbar : undefined, // 设置jQuery元素为工具栏，例如：	#toolbar, .toolbar。
			toolbarAlign : 'left', // 定义工具栏按钮的对齐方式，只能为："left", "right"。
			checkboxHeader : true, // 设置为False时隐藏表头中的全选复选框。
			sortable : true, // 设置为False时禁用所有列的排序
			maintainSelected : false, // 设置为True当换页或者搜索时保持选中的行(经过测试好像是无效的)
			searchTimeOut : 500, // 延迟执行搜索时间(毫秒)
			searchText : '', // 默认搜索的内容
			iconSize : undefined, // 按钮的样式(btn-XX)
			iconsPrefix : 'glyphicon', // glyphicon of fa (font awesome) 字体样式
			icons : {
				paginationSwitchDown: 'glyphicon-collapse-down icon-chevron-down',
	            paginationSwitchUp: 'glyphicon-collapse-up icon-chevron-up',
	            refresh: 'glyphicon-refresh icon-refresh',
	            toggle: 'glyphicon-list-alt icon-list-alt',
	            columns: 'glyphicon-th icon-th',
	            detailOpen: 'glyphicon-plus icon-plus',
	            detailClose: 'glyphicon-minus icon-minus'
			}, // 页面

			rowStyle : function(row, index) {
				 // 行样式格式化方法，有两个参数： row: 行记录的数据。 index: 行数据的 index。支持 classes 或者 css.
				return {};
			},

			rowAttributes : function(row, index) {
				 // 该行的属性格式化功能，需要两个参数：
				// 行：行记录数据。
				// 指数：该行的索引。
				// 支持所有的自定义属性。
				return {"na":"et"};
			},

			onAll : function(name, args) {
				 // 所有事件触发的方法 name:事件的名称 args:数据
				return false;
			},
			onClickCell : function(field, value, row, $element) {
				 // 单击单元格
				return false;
			},
			onDblClickCell : function(field, value, row, $element) {
				 // 双击单元格
				return false;
			},
			onClickRow : function(item, $element) {
				 // 单击数据列
				return false;
			},
			onDblClickRow : function(item, $element) {
				 // 双击数据列
				return false;
			},
			onSort : function(name, order) {
				 // 单击排序
				return false;
			},
			onCheck : function(row) {
				 // 选中列复选框
				return false;
			},
			onUncheck : function(row) {
				 // 取消列复选框
				return false;
			},
			onCheckAll : function(rows) {
				 // 选中选中数据库头部复选框
				return false;
			},
			onUncheckAll : function(rows) {
				 // 取消选中数据库头部复选框
				return false;
			},
			onCheckSome : function(rows) {
				 // 
				return false;
			},
			onUncheckSome : function(rows) {
				 // 
				return false;
			},
			onLoadSuccess : function(data) {
				 // 加载成功
				return false;
			},
			onLoadError : function(status) {
				 // 加载出错
				return false;
			},
			onColumnSwitch : function(field, checked) {
				 // 在做列选项勾选时触发的事件
				return false;
			},
			onPageChange : function(number, size) {
				 // 
				return false;
			},
			onSearch : function(text) {
				 // 搜索框搜索时触发的事件
				return false;
			},
			onToggle : function(cardView) {
				 // 
				return false;
			},
			onPreBody : function(data) {
				 // 
				return false;
			},
			onPostBody : function() {
				 // 
				return false;
			},
			onPostHeader : function() {
				 // 
				return false;
			},
			onExpandRow : function(index, row, $detail) {
				 // 
				return false;
			},
			onCollapseRow : function(index, row) {
				 // 
				return false;
			},
	        onRefreshOptions: function (options) {
	            return false;
	        },
	        onResetView: function () {
	            return false;
	        }
		}
		
		var sprintf = function (str) {
	        var args = arguments,
	            flag = true,
	            i = 1;

	        str = str.replace(/%s/g, function () {
	            var arg = args[i++];

	            if (typeof arg === 'undefined') {
	                flag = false;
	                return '';
	            }
	            return arg;
	        });
	        return flag ? str : '';
	    };
		
		var LOCALES = {
		        formatLoadingMessage: function () {
		            return '正在加载数据...';
		        },
		        formatRecordsPerPage: function (pageNumber) {
		            return sprintf('每页 %s 行', pageNumber);
		        },
		        formatShowingRows: function (pageFrom, pageTo, totalRows, pageSize) {
		        	var startPage = parseInt(pageFrom/pageSize) + 1;
		        	var endPage = totalRows%pageSize;
		        	if(endPage == 0){
		        		endPage = parseInt(totalRows/pageSize, 10);
		        	} else {
		        		endPage = parseInt(totalRows/pageSize, 10) + 1;
		        	}
		            return sprintf('共  %s 行  %s / %s页 ', totalRows, startPage, endPage);
		        },
		        formatDetailPagination: function (totalRows) {
		            return sprintf('共 %s 行', totalRows);
		        },
		        formatSearch: function () {
		            return '关键字搜索';
		        },
		        formatNoMatches: function () {
		            return '没有查询到任何数据';
		        },
		        formatPaginationSwitch: function () {
		            return '隐藏/显示 分页';
		        },
		        formatRefresh: function () {
		            return '刷新';
		        },
		        formatToggle: function () {
		            return '切换';
		        },
		        formatColumns: function () {
		            return 'Columns';
		        },
		        formatAllRows: function () {
		            return 'All';
		        }
		    };
		if(!options){
			options = defaults;
		} else {
			options = $.extend(true, {}, LOCALES, defaults, options);
		}
		if(typeof(selector) === "string" || typeof(selector) === "object"){
			return $(selector).bootstrapTable(options);
		} else if(selector instanceof Array){
			var tableArray = [];
			for(var i=0;i<selector.length;i++){
				tableArray.push($(selector[i]).bootstrapTable(options));
			}
			return tableArray;
		}
	},
	
	//格式化
	site.table.formatter = {
		date: function(value, row, index, format){
			if(value instanceof Date){
				return site.utils.dateFormat(value, format);
			} else if(value instanceof Object && value.time){
				return site.utils.dateFormat(new Date(value.time), format);
			}
			return value;
		}
	}
})();
