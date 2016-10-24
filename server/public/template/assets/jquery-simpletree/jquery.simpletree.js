/*
 * Fuel UX Tree
 * https://github.com/ExactTarget/fuelux
 *
 * Copyright (c) 2012 ExactTarget
 * Licensed under the MIT license.
 */

var DataSourceTree = function (options) {
    this._data = options.data;
    this._delay = options.delay;
};

DataSourceTree.prototype = {

    data: function (options, callback) {
        var self = this;

        setTimeout(function () {
            var data = $.extend(true, [], self._data);

            callback({
                data: data
            });

        }, this._delay)
    }

};

// TREE CONSTRUCTOR AND PROTOTYPE

var Tree = function (element, options) {
    this.$element = $(element);
    this.options = $.extend({}, $.fn.tree.defaults, options);

    this.$element.on('click', '.tree-item', $.proxy(function (ev) {
        this.selectItem(ev.currentTarget);
    }, this));
    this.$element.on('click', '.tree-folder-header', $.proxy(function (ev) {
        this.selectFolder(ev.currentTarget);
    }, this));

    this.render();
};

Tree.prototype = {
    constructor: Tree,

    render: function () {
        this.populate(this.$element);
    },

    populate: function ($el) {
        var self = this;
        var loader = $el.parent().find('.tree-loader:eq(0)');

        loader.show();
        $el.parent().find('i').removeClass(this.options.folderCloseIcon).addClass(this.options.loadingIcon);
        this.options.dataSource.data($el.data(), function (items) {
            $el.parent().find('i').removeClass(self.options.loadingIcon);

            $.each(items.data, function (index, value) {
                var $entity;
                if (value.type === "folder") {
                    $entity = self.$element.find('.tree-folder:eq(0)').clone().show();
                    $entity.find('.tree-folder-name').html(value.name);
                    $entity.find('.tree-folder-header').data(value);
                } else if (value.type === "item") {
                    $entity = self.$element.find('.tree-item:eq(0)').clone().show();
                    $entity.find('.tree-item-name').html(value.name);
                    $entity.data(value);
                }

                if ($el.hasClass('tree-folder-header')) {
                    $el.parent().find('.tree-folder-content:eq(0)').append($entity);
                } else {
                    $el.append($entity);
                }
            });

            self.$element.trigger('loaded');
        });
    },

    selectItem: function (el) {
        var $el = $(el);
        var $all = this.$element.find('.tree-selected');
        var data = [];

        if (this.options.multiSelect) {
            $.each($all, function (index, value) {
                var $val = $(value);
                if ($val[0] !== $el[0]) {
                    data.push($(value).data());
                }
            });
        } else if ($all[0] !== $el[0]) {
            $all.removeClass('tree-selected')
                .find('i').removeClass(this.options.itemCheckedIcon).addClass(this.options.itemIcon);
            data.push($el.data());
        }

        if ($el.hasClass('tree-selected')) {
            $el.removeClass('tree-selected');
            $el.find('i').removeClass(this.options.itemCheckedIcon).addClass(this.options.itemIcon);
        } else {
            $el.addClass('tree-selected');
            $el.find('i').removeClass(this.options.itemIcon).addClass(this.options.itemCheckedIcon);
            if (this.options.multiSelect) {
                data.push($el.data());
            }
        }

        if (data.length) {
            this.$element.trigger('selected', {
                info: data
            });
        }
    },

    selectFolder: function (el) {
        var $el = $(el);
        var $par = $el.parent();

        if ($el.find('.' + this.options.folderCloseIcon).length) {
            if ($par.find('.tree-folder-content').children().length) {
                $par.find('.tree-folder-content:eq(0)').show();
            } else {
                this.populate($el);
            }

            $par.find('.' + this.options.folderCloseIcon + ':eq(0)')
                .removeClass('.' + this.options.folderCloseIcon)
                .addClass('.' + this.options.folderOpenIcon);

            this.$element.trigger('opened', $el.data());
        } else {
            if (this.options.cacheItems) {
                $par.find('.tree-folder-content:eq(0)').hide();
            } else {
                $par.find('.tree-folder-content:eq(0)').empty();
            }

            $par.find('.' + this.options.folderOpenIcon + ':eq(0)')
                .removeClass('.' + this.options.folderOpenIcon)
                .addClass('.' + this.options.folderCloseIcon);

            this.$element.trigger('closed', $el.data());
        }
    },

    selectedItems: function () {
        var $sel = this.$element.find('.tree-selected');
        var data = [];

        $.each($sel, function (index, value) {
            data.push($(value).data());
        });
        return data;
    }
};


// TREE PLUGIN DEFINITION

$.fn.tree = function (option, value) {
    var methodReturn;

    var $set = this.each(function () {
        var $this = $(this);
        var data = $this.data('tree');
        var options = typeof option === 'object' && option;

        if (!data) $this.data('tree', (data = new Tree(this, options)));
        if (typeof option === 'string') methodReturn = data[option](value);
    });

    return (methodReturn === undefined) ? $set : methodReturn;
};

$.fn.tree.defaults = {
    multiSelect: false,
    folderCloseIcon : 'icon-folder-close',
    folderOpenIcon : 'icon-folder-open',
    itemIcon : 'icon-file',
    itemCheckedIcon : 'icon-ok',
    loadingIcon: 'icon-spinner icon-spin',
    loadingHTML: '<div>Loading...</div>',
    cacheItems: true
};

$.fn.tree.Constructor = Tree;