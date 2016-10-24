/**
 * Created by simon on 15/11/8.
 */
;
(function (window, $) {
    var EVENT_COLUMN_CHANGED = 'columnChanged';
    var EVENT_ROW_CHANGED = 'rowChanged';
    var EVENT_ROW_INSERTED = 'rowInserted';
    var EVENT_ROW_DELETED = 'rowDeleted';
    var LEFT_ARROW = 37;
    var UP_ARROW = 38;
    var RIGHT_ARROW = 39;
    var DOWN_ARROW = 40;
    var KEY_DELETE = 46;

    function Table(opt) {
        this.cols = opt.cols;
        this.headerClassName = opt.headerClassName;
        this.itemClassName = opt.itemClassName;
        this.className = opt.className || this.className;
        this.container = $(opt.container);
        this.data = opt.data || [];
        this.onDeleteItem = opt.onDeleteItem;
        this.onUpdateItem = opt.onUpdateItem;
        this.id = opt.id || "table__";
        this.init();
    }

    window.NCTable = Table;
    Table.prototype = {
        container: null,
        cols: [],
        op: true,
        headerClassName: '',
        itemClassName: '',
        className: 'table table-striped table-bordered table-advance table-hover',
        data: [],
        init: function () {
            var that = this;
            this.refresh();
            $(this.container).on('click', '*[data-op="delete"]', function (evt) {
                that._onDeleteItem.call(this, evt, that);
            })
            $(this.container).on('blur', '*[data-op="update"]', function (evt) {
                that._onUpdateItem.call(this, evt, that);
            });
            $(this.container).on('keydown', 'input', function (evt) {
                evt.stopImmediatePropagation();
                var col=parseInt($(this).attr('data-col'));
                var row=parseInt($(this).attr('data-row'));
                switch (evt.keyCode) {
                    case LEFT_ARROW:
                        that._keyLeft(col , row);
                        break;
                    case RIGHT_ARROW:
                        that._keyRight(col, row);
                        break;
                    case UP_ARROW:
                        that._keyUp(col, row,evt);
                        break;
                    case DOWN_ARROW:
                        that._keyDown(col, row,evt);
                        break;
                    case KEY_DELETE:
                        that._keyDelete(col, row);
                        break;

                }

            })
        },
        _keyRight: function (col, row) {
            $(this.container).find('input[data-col='+(col+1)+'][data-row='+(row)+']').focus().select();;
        },
        _keyLeft: function (col, row) {
            $(this.container).find('input[data-col='+(col-1)+'][data-row='+(row)+']').focus().select();;
        },
        _keyUp: function (col, row,evt) {
            $(this.container).find('input[data-col='+(col)+'][data-row='+(row-1)+']').focus().select();
            evt.preventDefault();
            return false;
        },
        _keyDown: function (col, row,evt) {
            $(this.container).find('input[data-col='+(col)+'][data-row='+(row+1)+']').focus().select();
            evt.preventDefault();
            return false;
        },
        _keyDelete:function(col,row){
            this.onDeleteItem && this.onDeleteItem($(this.container).find('tr[data-row='+(row)+'] a[data-op="delete"]').attr('data-id'))
        },
        _onDeleteItem: function (evt, obj) {
            obj.onDeleteItem && obj.onDeleteItem($(this).attr('data-id'))
        },
        _onUpdateItem: function (evt, obj) {
            obj.onUpdateItem && obj.onUpdateItem($(this).attr('data-id'), $(this).attr('data-key'), $(this).val())
        },
        _getHeader: function () {
            try {
                var _html = '<thead class="' + this.headerClassName + '"><tr>';
                for (var i = 1; i <= this.cols.length; i++) {
                    var _display = "";
                    if (!this.cols[i - 1]['visible']) {
                        _display = ' style="display:none" '
                    }
                    _html += '<th data-id="head_' + i + '" ' + _display + '>' + this.cols[i - 1]['title'] + '</th>';
                }
                if (this.op) {
                    _html += '<th data-id="head_op">操作</th>'
                }
                _html += '</tr></thead>';
                return _html;
            } catch (ex) {
                throw new Error('请检查列数据');
            }
        },
        _getItem: function (i, item) {
            try {

                var _html = '<tr data-id="item_<%=i%>" data-row="<%=i%>" class="<%=itemClassName%>">';
                _html += '<% for ( var k = 1; k <= cols.length; k++ ) { %>';
                _html += '<% var alias=cols[k-1]["alias"];var _display="";if(!cols[k-1]["visible"]){_display=\' style="display:none" \';} %>';
                _html += '<td data-id="cell_<%=item[alias]%> " <%=_display%>>';
                _html += '<%if (!cols[k - 1]["editable"]) {%>';
                _html += '<label data-col="<%=k%>" data-row="<%=i%>"><%=item[alias]%></label>';
                _html += '<% }else{ %>';
                _html += '<% var _type=cols[k-1]["type"]||"text";var _attr="",_value=item[alias]||cols[k-1]["value"]||0;%>';
                _html += '<%if(_type=="number"){_attr=" max=2000 min=0 ";} %>';
                _html += '<input data-id="<%=item[cols[0].alias]%>" data-op="update" data-col="<%=k%>" data-key="<%=alias%>" data-row="<%=i%>" type="<%=_type%>" <%=_attr%> value="<%=_value %>"/>';
                _html += '<% } %>';
                _html += '</td>';
                _html += '<% } %>';
                _html += '<td <%=_display%>><a data-op="delete" data-id="<%=item[cols[0].alias]%>" href="javascript:void(0);" data-col="<%=k%>" data-row="<%=i%>" class="btn mini black btnDeleteSku">删除</a></td>';
                _html += '</tr>';

                return Table.tmpl(_html, {
                    i: i,
                    cols: this.cols,
                    item: item,
                    itemClassName: this.itemClassName
                });
            } catch (ex) {
                throw new Error('请检查列数据');
            }
        },
        /**
         * 定义列
         * @param opt
         */
        defineColumns: function (opt) {
            opt = opt || this.cols;
            this.cols = opt;
            events.publish('EVENT_COLUMN_CHANGED')
        },
        /**
         * 刷新表格
         */
        refresh: function (data) {
            data = data || this.data;
            this.data = data;
            var _html = '<table id="' + this.id + '" class="' + this.className + '">';
            _html += this._getHeader();
            _html += '<tbody>';
            for (var i = 1; i <= this.data.length; i++) {
                _html += this._getItem(i, this.data[i - 1]);
            }
            _html += '</tbody>';
            _html += '</table>';
            this.container.html(_html);

        },
        /**
         * 插入行
         * todo
         */
        insertRow: function () {

        },
        /**
         * 删除行
         *
         */
        deleteRow: function (callback) {

        },
        /**
         * 更新行
         * todo
         */
        updateRow: function () {

        },
        /**
         * 取回数据
         */
        getData: function (format) {

        }
    }
    /**
     * 订阅者，就不多说了
     */
    var events = (function () {
        var topics = {};
        var hOP = topics.hasOwnProperty;

        return {
            subscribe: function (topic, listener) {
                if (!hOP.call(topics, topic)) topics[topic] = [];

                var index = topics[topic].push(listener) - 1;

                return {
                    remove: function () {
                        delete topics[topic][index];
                    }
                };
            },
            publish: function (topic, info) {
                if (!hOP.call(topics, topic)) return;

                topics[topic].forEach(function (item) {
                    item(info != undefined ? info : {});
                });
            }
        };
    })();
    // Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
    (function (host) {
        var cache = {};

        host.tmpl = function tmpl(str, data) {
            // Figure out if we're getting a template, or if we need to
            // load the template - and be sure to cache the result.
            var fn = !/\W/.test(str) ?
                cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

                // Generate a reusable function that will serve as a template
                // generator (and which will be cached).
                new Function("obj",
                    "var p=[],print=function(){p.push.apply(p,arguments);};" +

                        // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +

                        // Convert the template into pure JavaScript
                    str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'")
                    + "');}return p.join('');");

            // Provide some basic currying to the user
            return data ? fn(data) : fn;
        };
    })(Table);
})(window, jQuery);