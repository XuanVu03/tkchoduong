/**
 * Created by khoait109@gmail.com
 * Website: http://kayn.pro/
 */
var haveChangeData = true;
jQuery(document).ready(function () {
    try {
        jQuery('form .form-control').change(function (e) {
            haveChangeData = true;
        })
    } catch (e) {

    }
    try {
        initUploadNotes();
    } catch (e) {

    }
    try {

        for(let i in lsFormUpload ){
            initUploadInputForm(lsFormUpload[i]);
        }
    } catch (e) {

    }
    try {
        loadNotification();//khai báo trong notification header
    } catch (e) {

    }
});
function admin_link(router) {
    if (typeof router === undefined) {
        router = '';
    }
    router = '/' + router.replace('//', '/');
    return window.location.origin + router
}

let MNG_STAFF = {
    showFormPosition(id) {
        return _SHOW_FORM_REMOTE(admin_link('staff/position/input?id=' + id));
    },
    showFormDepartment(id) {
        return _SHOW_FORM_REMOTE(admin_link('staff/department/input?id=' + id));
    },
    getListByDepartment(deparment_id, fillto) {
        let formdata = [{name: 'department_id', value: deparment_id}];
        let callBack = function (json) {
            if (json.status != 1) {
                alert(json.msg);
            } else {
                if (typeof json.data !== 'undefined') {
                    try {
                        var html = ''
                        for (var i in json.data) {
                            var staff = json.data[i];
                            var can_append = true;
                            jQuery(fillto).find('option').each(function (index, item) {
                                if (item) {
                                    if ($(item).attr('value') === staff._id) {
                                        can_append = false;
                                    }
                                }
                            })
                            if (typeof staff.name !== 'undefined' && can_append) {
                                html += '<option value="' + staff._id + '">' + staff.name + '</option>';
                            }
                        }
                        jQuery(fillto).append(html)
                    } catch (e) {
                        console.log(e)
                        jQuery(fillto).html('<option value="0">Không tìm thấy danh sách nhân sự</option>')
                    }
                }
            }
            jQuery(fillto).select2();
        };
        _POST(admin_link('staff/_get_staff_list'), formdata, callBack);
    }
};
var MNG_PROJECT = {
    showSwitch() {
        return _SHOW_FORM_REMOTE(admin_link('project/show-switch?popup=true'));
    }
};
var MNG_DOCUMENT = {
    replyComment(commentParentId, commentChildId, documentId, commentType) {
        //comment parent
        let comment = $('#content_reply_' + commentParentId).val();

        if (commentType == 2)
            comment = $('#content_reply_' + commentParentId + '_' + commentChildId).val();

        let formdata = [
            {name: 'reply_id', value: commentParentId},
            {name: 'comment', value: comment},
            {name: 'document_id', value: documentId}
        ];
        let callBack = function (json) {
            if (json.status != 1) {
                alert(json.msg);
            } else {
                if (typeof json.data !== 'undefined') {
                    try {
                        location.reload(true);
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        };
        _POST(admin_link('document/_reply_comment'), formdata, callBack);
    },

    editComment(commentParentId, commentChildId, documentId, commentType) {
        //comment parent
        let comment = $('#content_new_' + commentParentId).val();

        if (commentType == 2)
            comment = $('#content_new_' + commentParentId + '_' + commentChildId).val();

        let formdata = [
            {name: 'comment_parent_id', value: commentParentId},
            {name: 'comment_child_id', value: commentChildId},
            {name: 'commentType', value: commentType},
            {name: 'comment', value: comment},
            {name: 'document_id', value: documentId}
        ];
        let callBack = function (json) {
            if (json.status != 1) {
                alert(json.msg);
            } else {
                if (typeof json.data !== 'undefined') {
                    try {
                        location.reload(true);
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        };
        _POST(admin_link('document/_edit_comment'), formdata, callBack);
    },

    deleteComment(commentParentId, commentChildId, documentId, commentType) {

        if (!confirm('Bạn có chắc chắn muốn xóa không?'))
            return

        let formdata = [
            {name: 'comment_parent_id', value: commentParentId},
            {name: 'comment_child_id', value: commentChildId},
            {name: 'commentType', value: commentType},
            {name: 'document_id', value: documentId}
        ];
        let callBack = function (json) {
            if (json.status != 1) {
                alert(json.msg);
            } else {
                if (typeof json.data !== 'undefined') {
                    try {
                        location.reload(true);
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        };
        _POST(admin_link('document/_delete_comment'), formdata, callBack);
    },

    deleteAllDocument() {
        //Xử lý để lấy được danh sách id đã chọn
        let document_ids = [];
        $.each($("input:checkbox[name='document_ids']:checked"), function () {
            document_ids.push($(this).val());
        });

        if (document_ids == "") {
            alert("Chưa chọn văn bản cần xóa");
            return
        }
        if (!confirm('Bạn có chắc chắn muốn xóa không?'))
            return

        let formdata = [
            {name: 'document_ids', value: document_ids}
        ];
        let callBack = function (json) {
            if (json.status != 1) {
                alert(json.msg);
            } else {
                if (typeof json.data !== 'undefined') {
                    try {
                        location.reload(true);
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        };
        _POST(admin_link('document/_delete_document'), formdata, callBack);
    }

};

var MNG_CONTRACT = {
    export_excel() {
        //Xử lý để lấy được danh sách id đã chọn
        let item_ids = [];
        $.each($("input:checkbox[name='item_ids']:checked"), function () {
            item_ids.push($(this).val());
        });

        if (item_ids == "") {
            alert("Chưa chọn đối tượng cần xuất file");
            return
        }
        let formdata = [
            {name: 'item_ids', value: item_ids}
        ];
        let callBack = function (json) {
            if (json.status != 1) {
                alert(json.msg);
            } else {
                if (typeof json.data !== 'undefined') {
                    try {
                        location.reload(true);
                    } catch (e) {
                        console.log(e)
                    }
                }
            }
        };
        _POST(admin_link('contract/export_excel'), formdata, callBack);
    }
};

function _AUTO_COMPLETE_INIT(selector, link_api, text, multi, options) {
    if (typeof  multi === 'undefined') {
        multi = true;
    }
    let selected = $(selector).attr('data-selected');
    let disabled = $(selector).attr('disabled');
    let opt = {
        placeholder: text,
        multiple: multi,
        disabled : disabled,
        ajax: {
            url: link_api,
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: term,
                };
            },
            results: function (data, page) {
                return {results: data.data};
            },
        },

    }
    if (typeof options === 'object') {
        if (options.data) {
            opt.data = options.data

        }

    }
    let a = $(selector).select2(opt);
    try {
        a.select2('data', eval(selected));
        console.log(selected)
    } catch (e) {
        console.warn(e)
    }
}
function _AUTO_COMPLETE_INIT_FILTER(selector, link_api, text, multi, options) {
    if (typeof  multi === 'undefined') {
        multi = true;
    }
    let selected = $(selector).attr('data-selected');
    let opt = {
        placeholder: text,
        multiple: multi,
        ajax: {
            url: link_api,
            dataType: 'json',
            data: function (term, page) {
                return {
                    q: term,
                };
            },
            results: function (data, page) {
                return {results: data.data};
            },
        },
        initSelection: function (element, callback) {
            // the input tag has a value attribute preloaded that points to a preselected repository's id
            // this function resolves that id attribute to an object that select2 can render
            // using its formatResult renderer - that way the repository name is shown preselected
            var id = $(element).val();
            if (id !== "") {
                $.ajax(link_api, {
                    data: {
                        q: id
                    },
                    dataType: "json"
                }).done(function (data) {
                    callback(data.data);
                });
            }
        },
    }
    if (typeof options === 'object') {
        if (options.data) {
            opt.data = options.data

        }

    }
    let a = $(selector).select2(opt);
    try {
        a.select2('data', eval(selected));
        console.log(selected)
    } catch (e) {
        console.warn(e)
    }
}

function public_link(link) {
    return location.origin + '/' + link;
}

var APPLICATION = {
    getListCity(callBack) {
        _POST(public_link('public_api/location/get-all-city'), [], callBack);
    }, getLocationSub(parent_code, callBack) {
        _POST(public_link('public_api/location/get-sub-location?parent_key=' + parent_code), [], callBack);
    }, getPositionByDep(department_id, callBack) {
        _POST(public_link('public_api/staff/get-position-list?department_id=' + department_id), [], callBack);
        // _POST(admin_link('staff/get-position-list?department_id=' + department_id), [], callBack);
    },
    /**
     * Sử dụng điều hướng phần tỉnh thành quận huyện
     * tham khảo phần input khách hàng
     * @param parent_code
     * @param select_element
     * @param string_null
     * @returns {*}
     * @private
     */
    _changeCity(parent_code, select_element, string_null, _code) {
        jQuery(select_element).attr('readonly', true);
        if (select_element == '#location-district') {
            jQuery('#location-town').html('<option value="">Chọn xã phường</option>').select2();
        }
        return APPLICATION.getLocationSub(parent_code, function (json) {
            let html = '<option value="">' + string_null + '</option>';
            if (typeof json.data !== 'undefined') {
                for (let i in json.data) {
                    let location = json.data[i];
                    let selected = '';
                    if (typeof location.name !== 'undefined') {
                        html += '<option value="' + location.slug + '" ' + selected + '>' + location.name + '</option>';
                    }
                }
            }
            jQuery(select_element).attr('readonly', false).html(html).select2();
        });
    },
    _changeDepartment(department_id, select_element, string_null, _code) {
        jQuery(select_element).attr('readonly', true);

        return APPLICATION.getPositionByDep(department_id, function (json) {
            let html = '<option value="">' + string_null + '</option>';
            if (typeof json.data !== 'undefined') {
                for (let i in json.data) {
                    let position = json.data[i];
                    let selected = '';
                    if (_code && _code == position._id) {
                        selected = ' selected';
                    }
                    if (typeof position.name !== 'undefined') {
                        html += '<option value="' + position._id + '" ' + selected + '>' + position.name + '</option>';
                    }
                    console.log(position)
                }
            }
            console.log(select_element);
            jQuery(select_element).attr('readonly', false).html(html).select2();
        });
    }
};

function number_format(Num) {
    Num = Num.toString().replace(/^0+/, "").replace(/\./g, "").replace(/,/g, "");
    Num = "" + parseInt(Num);
    var temp1 = "";
    var temp2 = "";
    if (Num == 0 || Num == undefined || Num == '0' || Num == '' || isNaN(Num)) {
        return '';
    }
    else {
        var count = 0;
        for (var k = Num.length - 1; k >= 0; k--) {
            var oneChar = Num.charAt(k);
            if (count == 3) {
                temp1 += ".";
                temp1 += oneChar;
                count = 1;
                continue;
            }
            else {
                temp1 += oneChar;
                count++;
            }
        }
        for (var k = temp1.length - 1; k >= 0; k--) {
            var oneChar = temp1.charAt(k);
            temp2 += oneChar;
        }
        return temp2;
    }
}

function _SUBMIT_FORM(formId, link) {
    if (haveChangeData) {
        //haveChangeData = false;
        return _POST_FORM(formId, link)
    } else {
        $.toast({
            heading: 'Thông báo',
            position: 'top-right',
            text: 'Không có dữ liệu nào được thay đổi. Bạn cần thay đổi thông tin trước khi cập nhật',
            icon: 'info',
            loader: true,        // Change it to false to disable loader
            loaderBg: '#9EC600'  // To change the background
        });
    }
}
