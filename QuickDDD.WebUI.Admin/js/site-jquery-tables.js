/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-09-28 
 * 描述：数据列表插件
 */
var site = site || {};
$(function () {
	//业务操作
	var controler = {
		$selector: null,
		dataTables: null, //当前生成的数据表单
		firstColumnType: null, //首列类型
		firstColumns: {
			checkbox: {
				"name": "selector",
			    "data": null,
			    "class": "center",
			    "width": "40px",
			    "sortable": false,
			    "orderable": false,
			    "searchable": false,
			    "title": '<label><input type="checkbox" class="ace row-selector" /><span class="lbl padding-0"></span></label>',
			    "defaultContent": '<label><input type="checkbox" class="ace row-selector" /><span class="lbl padding-0"></span></label>',
			},//复选框列
			
			radio: {
				"name": "selector",
			    "data": null,
			    "class": "center",
			    "sortable": false,
			    "searchable": false,
			    "width": "40px",
			    "title": '选择',
			    "defaultContent": '<label><input type="radio" name="checkRadio" class="ace row-selector" /><span class="lbl padding-0"></span></label>'
			},//单选框列
			
			move: {
				"title": "排序", 
				"data": null,
				"sortable": false,
			    "searchable": false,
				"width": "40px", 
				"class": "center", 
				"defaultContent": "<label><i class=\"glyphicon glyphicon-move icon-move\"></i></label>"
			},//可拖拽列
			
			detail: {
				"title": "", 
				"data": null,
				"sortable": false,
			    "searchable": false,
				"width": "40px", 
				"class": "details-control",
				"defaultContent": ""
			} //详情列
		},//首列类型
		
		//增加列根据列类型
		addColumn: function(options){
			var columns = options.columns || [];
			var type = options.firstColumn;
			if(typeof(type) === "object"){
				type = options.firstColumn.type;
			}
			if(this.firstColumns[type]){
				columns.splice(0, 0, this.firstColumns[type]);
				options.columns = columns;
				this.firstColumnType = type;
				this.changeOrder(options);
			}
		},
		
		//初始化编辑单元格事件
		initEditableCellEvent: function(_columns, onEditableSave){
			var _this = this;
			for (var i = 0, j = _columns.length; i < j; i++) {
                if (_columns[i].editable) {
                    _columns[i]._createdCell = _columns[i].createdCell;
                    _columns[i].createdCell = function (td, cellData, rowData, row, col) {
                    	var aoColumns = _this.$selector.DataTable().context[0].aoColumns;
                        _this.createdEditableCell(td, cellData, rowData, row, col, aoColumns[col].data, aoColumns[col].render, aoColumns[col].editable, onEditableSave);
                    }
                }
            }
		},
		
		// 添加列工具栏
		addColToolBar: function(options, columns){
			//控制列显示隐藏的工具栏
			var defaults = {
            	visible: false, //默认是显示
            	buttonText: "选择需要显示的列", //按钮内容
                overlayFade: 200, //动画效果
                align: "right",
                showAll: "显示所有列",
                restore: "恢复默认列",
                fnLabel: function ( index, title, th ) {
                    return index + '. ' + title;
                }
			}
			if(this.firstColumnType){
				defaults.exclude = [0];
			}
			if(typeof(options) === "boolean"){
				defaults.visible = options;
			} else if(typeof(options) === "object"){
				defaults = $.extend({}, defaults, options);
			}
			if(defaults.visible != true){
				return;
			}
			var colvis = new $.fn.dataTable.ColVis(this.$selector.DataTable(), defaults);
            $('.buttons-panel').append($(colvis.button()));
		},
		
		changeOrder: function(options){
			// 修改排序顺序
			// 修改的原因就是加了选择列， 这列是不用排序的，但实际上如果有排序默认第一列排序，这是他们控件的BUG
			if(options.ordering === false){
				return;
			}
			if(!options.order){
				//如果没有排序就默认第二列排序
				options.order = [[ 1, "desc" ]];
			}
		},
		
		refresh: function(isRepeatLoad){
			var table = this.$selector.DataTable();
			// 局部绘制列表刷新
	        if (isRepeatLoad !== true) {
	            isRepeatLoad = false;
	            var selectArray = [];
	            this.$selector.find("tbody > tr").each(function(i, el){
	            	if($(el).find("td:eq(0) input[type=checkbox]").prop("checked") && $(el).closest('tr').attr("id")){
	            		selectArray.push($(el).closest('tr').attr("id"));
	            	}
	            });
	            this.$selector.data("selected", selectArray);
	        } else {
	        	//刷新的时候清空cheakbox
	            this.$selector.data("selected", "");
	        }
	        table.draw(isRepeatLoad);
		},
		
		// 获取拖拽后的表格数据
		getMoveData: function(){
			try{
				var idArray = this.$selector.sortable("toArray"),
				tableData = this.$selector.DataTable().data();
				moveData = [], isChange = false;
				for(var i=0, j=idArray.length; i<j; i++){
					for(var a=0; a<j; a++){
						if(idArray[i] === tableData[a]["DT_RowId"]){
							moveData.push(tableData[a]);
							if(!isChange && i != a){
								isChange = true;
							}
							break;
						}
					}
				}
				return isChange?moveData:null;
			} catch (e){
				console.info(e);
			}
			return null;
		},
		
		//获取选中的列表数据
        getSelectData: function(){
        	var data = this.$selector.DataTable().rows('.selected').data(), _data = [];
        	for(var i=0, j=data.length; i<j; i++){
        		_data.push(data[i]);
        	}
        	return _data;
        },
		
		//获取当前表格数据
		getTableData: function(){
			var tableData = this.$selector.DataTable().data()
				data = [];
			for(var i=0, j=tableData.length; i<j; i++){
				data.push(tableData[i]);
			}
			return data;
		},
		
		//创建编辑的单元格 |需要bootstrap-editab插件
		createdEditableCell: function(td, cellData, rowData, row, col, field, render, editableOptions, onEditableSave){
			var $td = $(td);
            $td.wrapInner('<a href="javascript:void(0)"' + ' data-name="' + field + '"' + ' data-pk="' + rowData.DT_RowId + '"' + ' data-value="' + cellData + '">' + '</a>');
            var $a = $td.children();
            if ($a.editable) {
                $a.editable(editableOptions).off('save').on('save', function (e, params) {
                    if (onEditableSave && $.isFunction(onEditableSave)) {
                        onEditableSave($a, cellData, params.submitValue, rowData, row, e);
                    } else {
                        rowData[field] = params.submitValue;
                    }
                });
            }
		},
		
		// 销毁事件
		destroy: function(){
			try{
				if(this.$selector.sortable){
					this.$selector.sortable("destroy");
				}
			} catch(e){
				console.info(e);
			}
			this.$selector.DataTable().destroy();
			this.$selector.unbind();
		},
		
		bindEvent: function(options){
			this.bindFilterEvent();
			this.bindButtonEvent();
			if(!this.firstColumnType){
				return;
			}
			if(this.firstColumnType === "checkbox"){
				this.bindCheckboxEvent();
			} else if(this.firstColumnType === "radio"){
				this.bindRadioEvent();
			} else if(this.firstColumnType === "detail"){
				this.bindDetailEvent(options.firstColumn);
			} else if(this.firstColumnType === "move"){
				this.bindMoveEvent(options.firstColumn);
			}
		},
		
		//复选框事件绑定
		bindCheckboxEvent: function(){
			var _this = this;
			_this.$selector.on("click", "thead > tr > th:eq(0) input[type=checkbox]", function(e){
				var checked = $(this).prop("checked");
				_this.$selector.find("tbody > tr").each(function(i, el){
					$(el).find("td:eq(0) input[type=checkbox]").prop("checked", checked);
					if(checked){
	                	$(this).addClass("selected");
	                } else {
	                	$(this).removeClass("selected");
	                }
				});
			});
			_this.$selector.on("click", "tbody > tr", function(e){
				if (e.isPropagationStopped()) return;
                e.stopPropagation();
                //选中非首列复选框操作
				if(e.target !== $(this).find("td:eq(0) input[type=checkbox]")[0]){
					$(this).find("td:eq(0) input[type=checkbox]").prop("checked", !$(this).find("td:eq(0) input[type=checkbox]").prop("checked"));
				}
				if($(this).find("td:eq(0) input[type=checkbox]").prop("checked")){
                	$(this).addClass("selected");
                } else {
                	$(this).removeClass("selected");
                }
			});
		},
		
		// 单选框事件绑定
		bindRadioEvent: function(){
			var _this = this;
			_this.$selector.on("click", "tbody > tr", function(e){
				if (e.isPropagationStopped()) return;
                e.stopPropagation();
                //选中非首列复选框操作
				if(e.target !== $(this).find("td:eq(0) input[type=radio]")[0]){
					$(this).find("td:eq(0) input[type=radio]").prop("checked", !$(this).find("td:eq(0) input[type=radio]").prop("checked"));
				}
				if($(this).find("td:eq(0) input[type=radio]").prop("checked")){
					_this.$selector.find("tr.selected").removeClass("selected");
                	$(this).addClass("selected");
                } else {
                	$(this).removeClass("selected");
                }
			});
		},
		
		//上下移动事件绑定
		bindMoveEvent: function(firstColumn){
			var _this = this, tables = _this.$selector.DataTable();
			_this.$selector.sortable({ //这里是talbe tbody，绑定 了sortable
                cursor: "move",
                items: "> tbody > tr",
                handle: "td:first",
                containment: _this.$selector.parent(),
                opacity: 0.7,
                revert: false,
                helper: function (e, ui) {
                    //在拖动时，拖动行的cell（单元格）宽度会发生改变
//                    var thead_tr = $(this).prev().children(0);
//                    thead_tr.children().each(function () {
//                        var th = $(thead_tr.children()[$(this).index()]);
//                        th.attr('data-originalwidth', th[0].style['width']);
//                        var width = th.width();
//                        th.width(width);
//                    });
//                    ui.children().each(function () {
//                        $(this).width($(this).width());
//                    });
                    return ui;
                },
                axis: "y",
                start: function (e, ui) {
                    return ui;
                },
                update: function (event, ui) { //更新排序之后
                	var id = ui.item.attr("id"), 
                		currentArray = $(this).sortable("toArray"),
                		tableData = _this.getTableData(), 
                		moveToIndex = -1,//移动至目的的索引位置
                		oldIndex = -1; //未移动前的索引位置
                	for(var i=0, j=currentArray.length; i<j; i++){
                		if(id === currentArray[i]){
                			moveToIndex = i;
                		}
                		if(id === tableData[i]["DT_RowId"]){
                			oldIndex = i;
                		}
                		if(moveToIndex != -1 && oldIndex != -1){
                			break;
                		}
                	}
                	if(firstColumn.moveCallbackFun && $.isFunction(firstColumn.moveCallbackFun)){
                		firstColumn.moveCallbackFun(tableData, oldIndex, moveToIndex);
                	}
                },
                stop: function (e, ui) {
//                    ui.item.children().each(function () { //清除拖动行的列宽
//                        $(this).width('');
//                    });
//                    var thead_tr = $($(this).prev().children()[0]);
//                    thead_tr.children().each(function () { //清除头行的列宽
//                        $(this).width('');
//                    });
//                    thead_tr.children().each(function () { //还原头行拖动前的width
//                        $(this).css('width', $(this).attr('data-originalwidth'));
//                    });
                    return ui;
                }
            });
		},
		
		//列详情信息事件绑定
		bindDetailEvent: function(firstColumn){
			var _this = this, dataTables = _this.$selector.DataTable();
			_this.$selector.on('click', 'tbody > tr > td.details-control', function (e) {
		        var tr = $(this).closest('tr');
		        var row = dataTables.row(tr);
		        if (row.child.isShown()) {
		            // 如果行已经显示就关闭
		            row.child.hide();
		            tr.removeClass('shown');
		        } else {
		            // 显示内容
		        	var data = row.data();
		        	var contents = data.remark || data.detail;
		        	if(firstColumn.detailRenderFun && $.isFunction(firstColumn.detailRenderFun)){
		        		contents = firstColumn.detailRenderFun(row[0][0], data);
		        	}
		            row.child(contents).show();
		            tr.addClass('shown');
		        }
		    });
		},
		
		//过滤表单事件绑定
		bindFilterEvent: function(filterSelector){
			if(!filterSelector){
				filterSelector = '#filterbar';
			}
			var $filter = $(filterSelector);
			if($filter.length < 1){
				return;
			}
			// 条件过滤栏中控件的值改变时重新加载列表数据
            // 修改事件绑定方式
			$filter.find('select[filterField]:not([autopostback="false"]), input[type=text][filterField]:not([autopostback="false"])').change(function () {
                // 搜索默认是跳转到第一页
				controler.refresh(true);
            });
			$filter.on("click", 'input[type="radio"][filterField]:not([autopostback="false"]),input[type="checkbox"][filterField]:not([autopostback="false"])', function (events) {
                // 搜索默认是跳转到第一页
				controler.refresh(true);
            });
            /**控制条件筛选中的文本框*/
			$filter.on('click', '.btnSearch', function () {
                // 搜索默认是跳转到第一页
				controler.refresh(true);
            });
			//关键词查询
			$filter.find('input[filterfield="Keywords"]').keyup(function () {
                if (event.keyCode === 13) {
                    // 搜索默认是跳转到第一页
                	controler.refresh(true);
                }
            });
		}, 
		
		bindButtonEvent: function(){
			var _this = this;
			//绑定刷新按钮
			$("#btnReload").on("click", function(){
				_this.refresh(false);
			});
		}
	}
	
    site.tables = {
        init: function (selector, options) {
            var defaults = $.extend(true, {
                "processing": true,
                "serverSide": true,
                "pagingType": "full_numbers",
                //<"top"f><"buttons-panel"> --add
                "dom": 'rt<"row"<"col-sm-2"i><"col-sm-2"l><"col-sm-8"p>><"clear">',
                "language": {
                	"decimal": ",",
                	"processing": "处理中...",
                    "lengthMenu": "每页 _MENU_ 条记录",
                    "zeroRecords": "对不起，查询不到任何相关数据",
                    "emptyTable": "未有相关数据",
                    "loadingRecords": "正在加载数据-请等待...",
                    "info": "第 _PAGE_ 页 ( 总共 _PAGES_ 页 )",
                    "infoEmpty": "无记录",
                    "infoFiltered": "(从 _MAX_ 条记录过滤)",
                    "infoPostFix": "",
                    "infoThousands": ",",
                    "search": "搜索",
                    "url": "",
                    "paginate": {
                        "first": "首页",
                        "previous": "上一页",
                        "next": "下一页",
                        "last": "末页"
                    },
                    "aria": {
                        "sortAscending": ": 以升序排列此列",
                        "sortDescending": ": 以降序排列此列"
                    },
                    initComplete: function () {
                    	//$(selector).find(".buttons-panel")
                    }
                }
            }, options);
            var tempDrawCallback = defaults.drawCallback;
            defaults.drawCallback = function (settings) {
            	if(tempDrawCallback && $.isFunction(tempDrawCallback)){
            		tempDrawCallback(settings);
            	}
                //数据列表刷新之后之前选中的数据继续选中
                var selectArray = $(selector).data("selected");
                if(selectArray && selectArray.length > 0){
                	$(selector).find("tbody > tr").each(function(i, el){
                		for(var i=0, j=selectArray.length;i<j;i++){
                			if($(el).attr("id") === selectArray[i]){
                				$(el).find("td:eq(0) input[type=checkbox]").prop("checked", true);
                				break;
                			}
                		}
    	            });
                }
            }
            controler.$selector = $(selector);
            controler.addColumn(defaults);
            //初始化编辑单元格事件
            controler.initEditableCellEvent(defaults.columns, defaults.onEditableSave);
            var dataTables = $(selector).dataTable(defaults);
            console.info(defaults);
            controler.bindEvent(defaults);
            controler.addColToolBar(defaults.colVis);
            return dataTables;
        },
        
        refresh: function(isRepeatLoad){
        	//刷新
        	controler.refresh(isRepeatLoad);
        },

        //获取选中的列表数据
        getSelectData: function(){
        	return controler.getSelectData();
        },
        
        //获取表格数据
        getTableData: function(){
        	return controler.getTableData();
        },
        
        //获取移动后的列表数据
        getMoveData: function(){
        	return controler.getMoveData();
        },
        
        // 销毁事件
		destroy: function(){
			controler.destroy();
		},
        
        ajax: function (options) {
            var conf = $.extend({}, options);
            return function (request, drawCallback, settings) {
                var parmetersData = {};
                parmetersData.pageSize = (request.length || 0) < 0 ? 10 : request.length;
                parmetersData.pageNumber = (request.start/parmetersData.pageSize) + 1;
                parmetersData.draw = request.draw || 0;
                parmetersData.search = request.search.value;
                if (request.order && request.order.length > 0) {
                	var sorting = [];
                    for (var i = 0; i < request.order.length; i++) {
                        var columnName = request.columns[request.order[i].column].data;
                        if (columnName) {
                            if(request.order[i].dir == "desc"){
                                columnName += " desc";
                            }
                            sorting.push(columnName);
                        }
                    }
                    if (sorting.length > 0) {
                        parmetersData.Sorting = sorting.join(",");
                    }
                }
                if ($.isFunction(conf.data)) {
                    $.extend(true, parmetersData, conf.data(request));
                } else if (typeof (conf.data) === "object") {
                    $.extend(true, parmetersData, conf.data);
                }
                var _conf = $.extend(true, {}, options);
                _conf.data = parmetersData;
                var _successFun = options.success;
                _conf.success = function (data, status, xhr) {
                    if ($.isFunction(_successFun)) {
                        _successFun(data, status, xhr);
                    }
                    parmetersData.draw = request.draw || 0;
                    if ($.isFunction(conf.responseHandler)) {
                        drawCallback(conf.responseHandler(data, parmetersData));
                    } else {
                        if (typeof (data) === "string") {
                        	data = JSON.parse(data);
                        }
                        var json = {
                            draw: parmetersData.draw,
                            data: data.result.pageData || [],
                            recordsTotal: data.result.pageCount || 0,
                            recordsFiltered: data.result.pageCount || 0
                        };
                        if(json.data && json.data.length > 0 && json.data[0].id){
                        	for (var i = 0, j = json.data.length; i < j; i++) {
  	                            json.data[i]['DT_RowId'] = json.data[i].id;
  	                        }
                        }
                        drawCallback(json);
                    }
                }
                settings.jqXHR = site.ajax(_conf);
            }
        }
    }
});