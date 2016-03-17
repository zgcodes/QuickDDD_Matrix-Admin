/**
 * 作者：yujinjin9@126.com 
 * 时间：2015-11-04 
 * 描述：首页信息
 */
$(function(){
	var buildForm = {
		views: {
			formDraggableContainer: $("#form-draggable-container"),// 拖拽的区域
			formDroppableContainer: $("#form-droppable-container"),// 拖动元素的目标容器
			chooseStyleButton: $("#choose-style"),// 选择样式的按钮
			getAllHtmlButton: $("#getAllHtml") //获取所有HTML按钮
		},
		
		operationTempl: [
		         '<p class="tools col-sm-12 col-sm-offset-3">',
		         '	<a class="edit-link">编辑HTML</a>',
		         '	<a>|</a>',
		         '	<a class="remove-link">移除</a>',
		         '</p>'].join("\n"),
		
		currentStyle: "horizontal-1",//inline:横排|horizontal-1:显示一列|horizontal-2:显示二列|up-down:上下排列
		
		init: function(){
			//初始化
			this.bindEvent();
			this.readOnly();
		},
		
		bindEvent: function(){
			//绑定事件
			this.draggableEvent();
			this.droppableEvent();
			this.sortableEvent();
			this.chooseStyleEvent();
			var _this = this;
			this.views.formDroppableContainer.on("click", "a.edit-link", function(events){
				_this.editFormHtml(this);
			});
			this.views.formDroppableContainer.on("click", "a.remove-link", function(events){
				_this.deleteForm(this);
			});
			this.views.getAllHtmlButton.on("click", function(events){
				_this.getAllHtml(this);
			});
		},
		
		draggableEvent: function(){
			//拖拽事件绑定
			this.views.formDraggableContainer.find("div.form-group[data-code]").draggable({
				//允许draggable被拖拽到指定的sortables中。如果使用了该选项，被拖动的元素可以被放置于一个应用了排序组件的元素列表中并成为该列表的一部分。
				//注意: 为了完美的使用该特性，helper选项必须被设置为"clone"。
				connectToSortable: this.views.formDroppableContainer,
				appendTo: "body",
				//如果值设置为"clone", 那么该元素将会被复制，并且被复制的元素将被拖动。
				helper: "clone",
				cursor: "move",
				//当拖动停止时，元素是否要被重置到它的初始位置。如果设置为"invalid", 重置仅当拖动没有被放置于一个可放置的对象时才会发生。
				revert: "invalid",
			});
		},
		
		droppableEvent: function(){
			//拖动元素的目标事件绑定
			var _this = this;
			_this.views.formDroppableContainer.droppable({
				accept : ".form-group",
				drop: function(e, ui) {
					//你妹， 代码会被执行2次,只能通过class来判断了。看了半天的源码才发现这个问题。
					if(!ui.draggable.hasClass("add")){
						ui.draggable.addClass("add");
						_this.addDropElement(ui.draggable);
					}
				}
			}).sortable();
		},
		
		sortableEvent: function(){
			//排序事件绑定
			this.views.formDroppableContainer.sortable({
				items : "> .form-group",
				distance : 1, //你妹，如果设置为0。会影响click事件
				cancel : ".t-node",
				opacity : .8,
				stop : function(e, ui) {
					$(ui.item).removeAttr("style");
				}
			});
		},
		
		chooseStyleEvent: function(){
			// 选择样式事件绑定
			var _this = this;
			this.views.chooseStyleButton.on("click", "a[data-style]", function(events){
				_this.currentStyle = $(this).attr("data-style");
				//inline:横排|horizontal-1:显示一列|horizontal-2:显示二列|up-down:上下排列
				if(_this.currentStyle === "inline"){
					_this.views.formDroppableContainer.removeClass("form-inline form-horizontal").addClass("form-inline");
					var $formGroup = _this.views.formDroppableContainer.find(".form-group");
					$formGroup.removeClass("col-md-6");
					$formGroup.children("label").removeClass().addClass("control-label");
					$formGroup.children("label").next("div").removeClass();
					$formGroup.children("p.tools").removeClass().addClass("tools");
				} else if(_this.currentStyle === "horizontal-1"){
					_this.views.formDroppableContainer.removeClass("form-inline form-horizontal").addClass("form-horizontal");
					var $formGroup = _this.views.formDroppableContainer.find(".form-group");
					if($formGroup.hasClass("col-md-6")){
						$formGroup.removeClass("col-md-6");
					}
					$formGroup.children("label").removeClass().addClass("control-label col-sm-3");
					$formGroup.children("label").next("div").removeClass().addClass("col-sm-9");
					$formGroup.children("p.tools").removeClass().addClass("tools col-sm-12 col-sm-offset-3");
				} else if(_this.currentStyle === "horizontal-2"){
					//显示二列
					_this.views.formDroppableContainer.removeClass("form-inline form-horizontal").addClass("form-horizontal");
					var $formGroup = _this.views.formDroppableContainer.find(".form-group");
					if(!$formGroup.hasClass("col-md-6")){
						$formGroup.addClass("col-md-6");
					}
					$formGroup.children("label").removeClass().addClass("control-label col-sm-4");
					$formGroup.children("label").next("div").removeClass().addClass("col-sm-8");
					$formGroup.children("p.tools").removeClass().addClass("tools col-sm-12 col-sm-offset-4");
				} else if(_this.currentStyle === "up-down"){
					_this.views.formDroppableContainer.removeClass("form-inline form-horizontal");
					var $formGroup = _this.views.formDroppableContainer.find(".form-group");
					$formGroup.removeClass("col-md-6");
					$formGroup.children("label").removeClass().addClass("control-label");
					$formGroup.children("label").next("div").removeClass();
					$formGroup.children("p.tools").removeClass().addClass("tools");
				} 
			});
		},
		
		readOnly: function(){
			//所有可拖拽的表单设置为不可编辑状态
//			this.views.formDraggableContainer.find("input,select,textarea").each(function(i, el){
//				$(el).attr("readonly", "true");
//			});
//			this.views.formDraggableContainer.find("input[type='file']").click(function(events){
//				events.preventDefault(); 
//			});
		},
		
		addDropElement: function(draggable){
			// 添加
			//inline:横排|horizontal-1:显示一列|horizontal-2:显示二列|up-down:上下排列
			var $operationTempl = $(this.operationTempl);
			if(this.currentStyle === "horizontal-2"){
				//显示二列
				draggable.find(".col-sm-3").removeClass("col-sm-3").addClass("col-sm-4");
				draggable.find(".col-sm-9").removeClass("col-sm-9").addClass("col-sm-8");
				draggable.addClass("col-md-6");
				$operationTempl.removeClass("col-sm-offset-3").addClass("col-sm-offset-4");
			} else if(this.currentStyle === "inline" || this.currentStyle === "up-down"){
				// 横排 | 上下排列
				draggable.find(".col-sm-3").removeClass("col-sm-3");
				draggable.find(".col-sm-9").removeClass("col-sm-9");
				draggable.find(".col-sm-9").remove();
				$operationTempl.removeClass("col-sm-12 col-sm-offset-3");
			}
			draggable.append($operationTempl);
		},
		
		editFormHtml: function(el){
			//编辑form表单Html
			var $el = $(el).parents(".form-group"), _this = this;
			var $el_copy = $el.clone();
			var $edit_btn = $el_copy.find(".edit-link").parent().remove();
			var _html = html_beautify($el_copy.html());
			var _dialog = site.dialog({
				"title":"编辑HTML",
				"width": "600px",
				"height": "400px",
				"message": '<textarea class="form-control" style="min-height: 250px; margin-bottom: 10px;font-family: Monaco, Fixed"></textarea>',
				"buttons": {
					"ok":{
						"label":"更新HTML",
						"className":"btn-primary",
						"callback": function(){
							var content = _dialog.find("textarea").val();
							if (!content) {
								$el.remove()
							} else {
								$el.html(content);
								$el.append(_this.operationTempl);
							}
						}
					},
					"cancel":{
						"label":"取消",
						"className":"btn-default"
					}
				}
			});
			_dialog.find("textarea").val(_html);
		},
		
		deleteForm: function(el){
			//编辑form表单Html
			site.confirm("确认移除该表单吗？", function(result){
				if(result){
					$(el).parents(".form-group").remove();
				}
			});
		},
		
		getAllHtml: function(){
			var $copy = this.views.formDroppableContainer.clone();
			$copy.find(".tools").remove();
	 		$.each(["draggable", "droppable", "sortable", "add", "dropped", "ui-draggable-handle", "ui-sortable", "ui-draggable", "ui-droppable", "form-body"], function(i, c) {
	 			$copy.find("." + c).removeClass(c).removeAttr("style")
	 		});
	 		var _html = html_beautify($copy.html());
	 		if(!_html){
	 			site.info("您还没有拖入表单内容!");
	 			return;
	 		}
			//获取当前编辑表单的所有元素HTML
			var _dialog = site.dialog({
				"title":"编辑HTML",
				"width": "600px",
				"height": "400px",
				"animate": false,
				"message": '<textarea class="form-control" style="min-height: 250px; margin-bottom: 10px;font-family: Monaco, Fixed">'+_html+'</textarea>',
			});
			_dialog.find("textarea").select().focus();
		}
	}
	
	buildForm.init();
});