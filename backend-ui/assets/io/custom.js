/* global $lsToursGioChot */

/**
 * Created by Ngannv(ngankt2@gmail.com)
 * Website: https://techhandle.net
 * Date: 3/9/19
 * Time: 1:47 PM
 */

/**
 * Created by ngankt2@gmail.com
 * Website: https://techhandle.net
 */

var haveChangeData = true;

jQuery(document).ready(function () {
    try {
        jQuery(".date-datepicker").flatpickr({enableTime: !0, dateFormat: "d/m/Y"})
    } catch (e) {
        //console.log(e)
    }
    try {
        jQuery(".datetime-datepicker").flatpickr({enableTime: !0, dateFormat: "d/m/Y H:i"})
    } catch (e) {
        //console.log(e)
    }

    try {
        jQuery('form .form-control').change(function (e) {
            haveChangeData = true;
        })
    } catch (e) {

    }

    try {
        INIT_SELECT2();
    } catch (e) {

    }

    try {
        INIT_SELECT2_WITH_TITLE();
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

    try{
        jQuery(".range-datepicker").flatpickr({
            mode: "range",dateFormat:'d/m/Y',
            allowInput: false,
            locale: {
                rangeSeparator:'-'
            },
            onChange: function(selDates, dateStr) {

            },
            onClose: function (selectedDates, dateStr, instance) {
                this.setDate(dateStr);
            }});
    }catch (e) {
        
    }
});

function admin_link(router) {
    if (typeof router === undefined) {
        router = '';
    }
    router = '/' + router.replace('//', '/');
    return window.location.origin + router
}

function vpdt_link(router) {
    if (typeof router === undefined) {
        router = '';
    }
    router = '/' + router.replace('//', '/');
    return `https://vpvietrantour.local` + router
}

function __callback(res) {

    switch (res.status) {
        case 'notif-error': {
            $.toast({
                heading: 'Thông báo lỗi',
                position: 'top-right',
                text: res.msg,
                icon: 'error',
                loader: true,        // Change it to false to disable loader
                loaderBg: '#9EC600'  // To change the background
            });
            break;
        }
        case 'notif-info': {
            $.toast({
                heading: 'Thông báo',
                position: 'top-right',
                text: res.msg,
                icon: 'info',
                loader: true,        // Change it to false to disable loader
                loaderBg: '#9EC600'  // To change the background
            });
            break;
        }
        case 'notif-success': {
            $.toast({
                heading: 'Thông báo',
                position: 'top-right',
                text: res.msg,
                icon: 'info',
                loader: true,        // Change it to false to disable loader
                loaderBg: '#4CAF50'  // To change the background
            });
            break;
        }
        case 1: {
            alert(res.msg);
            if (typeof res.data.reload !== "undefined" && res.data.reload === true) {
                if(getUrlParameters(window.location.href,'slink')){
                    let newLink  = removeParam('slink',window.location.href);
                    window.location.href = newLink;
                }else {
                    location.reload();
                }
            } else if (typeof res.data.redirect !== "undefined" && res.data.redirect) {
                window.location.href = res.data.redirect;
            }
            break;
        }
        default: {
            alert(res.msg);
            break;
        }
    }

}

function _GET_URL(url, options = {}) {
    jQuery.ajax({
        url: url,
        type: "GET",
        dataType: options.dataType || 'json',
        success: function (res) {
            if (typeof options.callback !== "undefined") {
                return eval(options.callback(res));
            }
            return eval(__callback(res));
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
        }
    });
    return false;
}

function _POST_FORM(formId, url, options = {}) {

    let {callback, type = 'json',globalCallback =true} = options;
    if (typeof callback !== 'function') {

    }
    let data = [];
    if(typeof formId !== "undefined") {
        data = $(formId).serializeArray();
    }else{

    }
    let _token = jQuery('meta[name=_token]').attr("content");
    if (_token) {
        let _data = {'name': '_token', 'value': _token};
        data.push(_data);
        $.ajaxSetup({
            headers: {
                'X-CSRF-TOKEN': _token
            }
        });
    }

    $.ajax({
        url: url,
        type: "POST",
        data: data,
        dataType: type,
        cache: false,
        success: function (res) {
            try {
                eval(options.callback(res))
            }catch(e) {

            }
            if(globalCallback){
                return eval(__callback(res));
            }
        },
        error: function (xhr, ajaxOptions, thrownError) {
            alert(thrownError);
        }
    });
    return false;

}


function _AUTO_COMPLETE_INIT(selector, link_api, text, multi, options) {
    if (typeof  multi === 'undefined') {
        multi = true;
    }
    let selected = $(selector).attr('data-selected');
    let disabled = $(selector).attr('disabled');
    let opt = {
        placeholder: text,
        multiple: multi,
        disabled: disabled,
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
            // using its formatResult renderer - that way the repository name is 
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

function _AUTO_COMPLETE_INIT_FILTER_SELECT_V4(selector, link_api, text, multi, options) {
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

    }
    if (typeof options === 'object') {
        if (options.data) {
            opt.data = options.data

        }

    }
    let a = $(selector).select2(opt);
    // try {
    //     a.val(selected).trigger('change');
    //     console.log(selected)
    // } catch (e) {
    //     console.warn(e)
    // }
}

function public_link(link) {
    return location.origin + '/' + link;
}

var APPLICATION = {
    getListCity(callBack) {
        _POST(public_link('public-api/location/get-all-city'), [], callBack);
    }, getLocationSub(parent_code, callBack) {
        _POST(public_link('public-api/location/get-sub-location?parent_key=' + parent_code), [], callBack);
    }, getPositionByDep(department_id, callBack) {
        _POST(public_link('public-api/staff/get-position-list?department_id=' + department_id), [], callBack);
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


function INIT_SELECT2_WITH_TITLE() {
    function select2FormatState(state) {
        console.log(state);
        if (!state.id) {
            return state.text;
        }

        return $(
            '<div class="select2-title"><div class="s1">' + state.text + '</div><i>' + state.title + '</i></div>'
        );
    };
    $('[data-toggle="select2-with-title"]').select2(
        {
            templateResult: select2FormatState
        }
    );
}

function INIT_SELECT2() {
    $('[data-toggle="select2"]').select2(

    );
}

function INIT_SELECT2_CREATE() {
    $('[data-toggle="select2-create"]').select2({
        tags: true
    });
}
//$.fn.modal.Constructor.prototype.enforceFocus = function () {};
function _SHOW_FORM_REMOTE(remote_link, target, multiform) {

    if (target === undefined || target == '') {
        target = 'myModal';
    }
    if (multiform != undefined) {
        target = target + remote_link.replace(/[^\w\s]/gi, '');
    } else {
        jQuery('.modal-backdrop').remove();
    }
    jQuery('#' + target).remove();
    jQuery('body').append('<div class="modal fade" id="' + target + '" tabindex="-1" role="dialog" ' +
        'aria-labelledby="' + target + 'Label" aria-hidden="true">' +
        '<div class="mmbd container-fluid"></div></div>');
    var modal = jQuery('#' + target), modalBody = jQuery('#' + target + ' .mmbd');
    modal.on('show.bs.modal', function () {
        jQuery(document).off('focusin.modal');
        modalBody.load(remote_link);
    }).modal({backdrop: 'static'});
    return false;
}
var HAVE_PUSH_SLINK = false;
function _SHOW_FORM_REMOTE_HAVE_LINK(remote_link, target, multiform){
    _SHOW_FORM_REMOTE(remote_link, target, multiform);
    let curentLink = window.location.href;
    let haveSlink = getUrlParameters(curentLink,'slink');
    console.log(curentLink)
    if(!haveSlink) {
        if (curentLink.indexOf("?") === -1) {
            curentLink += '?slink=' + btoa(remote_link);
        } else {
            curentLink += '&slink=' + btoa(remote_link);
        }
    }else{
        curentLink = replaceUrlParam(curentLink,'slink',btoa(remote_link));
    }
    console.log(curentLink)
    history.pushState(null, null, curentLink);
    HAVE_PUSH_SLINK = remote_link;
    //change link
    return false;
}

function _CLOSE_MODAL() {
    $('#myModal').remove()
    $('body').css({paddingRight:0})
    $('.modal-backdrop').remove()
    $('.modal-open').removeClass('modal-open');
    if(HAVE_PUSH_SLINK!==false){
        window.history.back();
        //todo: có thể check thêm nó là link gì
    }else{

        if(getUrlParameters(window.location.href,'slink')){
            //nếu có link tức là trường hợp này là share link thì close cái link này đi
            let link = removeURLParameter(window.location.href,'slink');
            window.location.href = link;
        }
    }

}
function removeParam(key, sourceURL) {

    var rtn = sourceURL.split("?")[0],
        param,
        params_arr = [],
        queryString = (sourceURL.indexOf("?") !== -1) ? sourceURL.split("?")[1] : "";
    if (queryString !== "") {
        params_arr = queryString.split("&");
        for (var i = params_arr.length - 1; i >= 0; i -= 1) {
            param = params_arr[i].split("=")[0];
            if (param === key) {
                params_arr.splice(i, 1);
            }
        }
        rtn = rtn + "?" + params_arr.join("&");
    }
    return rtn;
}
function removeURLParameter(url, parameter) {
    //prefer to use l.search if you have a location/link object
    var urlparts = url.split('?');
    if (urlparts.length >= 2) {

        var prefix = encodeURIComponent(parameter) + '=';
        var pars = urlparts[1].split(/[&;]/g);

        //reverse iteration as may be destructive
        for (var i = pars.length; i-- > 0;) {
            //idiom for string.startsWith
            if (pars[i].lastIndexOf(prefix, 0) !== -1) {
                pars.splice(i, 1);
            }
        }

        return urlparts[0] + (pars.length > 0 ? '?' + pars.join('&') : '');
    }
    return url;
}
function replaceUrlParam(url, paramName, paramValue)
{
    if (paramValue == null) {
        paramValue = '';
    }
    var pattern = new RegExp('\\b('+paramName+'=).*?(&|#|$)');
    if (url.search(pattern)>=0) {
        return url.replace(pattern,'$1' + paramValue + '$2');
    }
    url = url.replace(/[?#]$/,'');
    let a =  url + (url.indexOf('?')>0 ? '&' : '?') + paramName + '=' + paramValue;
    console.log(a);
    return a;
}
function getUrlParameters(url, name) {
    let _url = new URL(url);
    return _url.searchParams.get(name);
}

function _REMOVE_ITEM(link) {
    Swal.fire(
        {
            title: "Bạn có chắc chắn muốn xóa bản ghi này?", text: "Lưu ý: dữ liệu bị xóa sẽ không thể phục hồi lại được!", type: "warning", showCancelButton: !0,
            confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
            confirmButtonClass: "btn btn-success mt-2 btn-sm", cancelButtonClass: "btn btn-danger ml-2 mt-2 btn-sm", buttonsStyling: !1,
            confirmButtonText: "Vâng, Tôi muốn xóa!"
        }).then(function (t) {
        if (t.value) {
            return _GET_URL(link);
        }
    });
}

function _REVERT_ITEM(link) {
    Swal.fire(
        {
            title: "Bản ghi này đã bị xóa!", text: "Bạn có chắc chắn muốn khôi phục lại bản ghi này?", type: "warning", showCancelButton: !0,
            confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
            confirmButtonClass: "btn btn-success mt-2 btn-sm", cancelButtonClass: "btn btn-danger ml-2 mt-2 btn-sm", buttonsStyling: !1,
            confirmButtonText: "Vâng, Khôi phục lại!"
        }).then(function (t) {
        if (t.value) {
            return _GET_URL(link);
        }
    });

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

function _UPLOAD_INIT(picker = 'pickfiles', container = '#documentFileRegion', addedCalback, doneCallback) {
    addedCalback = addedCalback || function () {
    };
    doneCallback = doneCallback || function () {
    };
    var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: picker,
        url: '/media/do-upload',
        filters: {
            max_file_size: '30mb',
            mime_types: [
                {title: "Chọn file bất kỳ", extensions: "*"},
            ]
        },
        multipart_params: {'_token': jQuery('meta[name=_token]').attr("content")},
        init: {
            FilesAdded: function (up, files) {
                var $element = $('#uploadFileItemClone').clone();
                for (var i in files) {
                    var file = files[i]
                    try {
                        $element.find('.js-document-container').attr('id', file.id);
                        $element.find('.js-document-loading').show()
                        $(container).append($element.html());
                    } catch (e) {

                    }
                    try {
                        addedCalback(file)
                    } catch (e) {

                    }

                }
                //jQuery(options.loading_element).show()
                uploader.start();
            },
            FileUploaded: function (up, file, response) {
                haveChangeData = true;
                uploader.removeFile(file);
                response = JSON.parse(response.response);
                let $_element = $('#' + file.id);
                try {
                    $_element.find('.js-document-loading').hide()
                    $_element.find('.js-document-file').val(response.data.relative_link)
                    $_element.find('.js-document-link').attr('href', response.data.full_size_link)
                    $_element.find('.js-document-del').on('click', function () {
                        Swal.fire(
                            {
                                title: "Bạn có chắc chắn muốn xóa file này?", text: "Lưu ý: dữ liệu bị xóa sẽ không thể phục hồi lại được!", type: "warning", showCancelButton: !0,
                                confirmButtonColor: "#3085d6", cancelButtonColor: "#d33",
                                confirmButtonClass: "btn btn-success mt-2 btn-sm", cancelButtonClass: "btn btn-danger ml-2 mt-2 btn-sm", buttonsStyling: !1,
                                confirmButtonText: "Vâng, Tôi muốn xóa!"
                            }).then(function (t) {
                            if (t.value) {
                                $('#' + file.id).remove();
                                haveChangeData = true
                            }
                        });

                    });
                } catch (e) {

                }

                try {
                    console.log(doneCallback)
                    doneCallback(response,file)
                } catch (e) {

                }
            },

        }
    });
    uploader.init();
    uploader.bind('FilesAdded', function (up, files) {
    });

}

function _SAVE_HISTORY(item = {name: '', id: '', link: '', popup: '', object_name: ''}) {
    console.log(item);
    if (item.id.length < 10) {
        return false;
    }
    let lsHistory = localStorage.getItem('lsHistory');
    try {
        lsHistory = JSON.parse(lsHistory);
        if (lsHistory) {
            for (let i in lsHistory) {
                let _item = lsHistory[i];
                if (_item.id === item.id) {
                    //remove cái này đi
                    lsHistory.splice(i, 1);
                    break;
                }
            }
            try {
                if (lsHistory.length > 30) {
                    lsHistory.pop();
                }
            } catch (e) {

            }
        } else {
            lsHistory = [];
        }
        lsHistory.unshift(item);
        localStorage.setItem('lsHistory', JSON.stringify(lsHistory));
    } catch (e) {
        console.log('history', e);
    }
}
/**
 *
 * Phê duyệt báo cáo
 */
function approveReport(link,obj){
    if($(obj).hasClass('ok-done')){
        alert('Bạn đã duyệt báo cáo này rồi!');
        return false;
    }
    Swal.fire(
        {
            title: "Phê duyệt báo cáo",
            text: "Bạn có chắc chắn muốn phê duyệt báo cáo này?",
            type: "warning",
            showCancelButton: !0,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonClass: "btn btn-success mt-2 btn-sm",
            cancelButtonClass: "btn btn-danger ml-2 mt-2 btn-sm",
            buttonsStyling: !1,
            confirmButtonText: "Vâng, Tôi muốn phê duyệt!"
        }).then(function (t) {
        if (t.value) {
            return _GET_URL(link,{
                callback:function(json){
                    if(json.status=='notif-success'){
                        $(obj).html('Đã duyệt').removeClass('btn-secondary').addClass('btn-success').addClass('ok-done');
                    }
                    alert(json.msg);
                }
            });
        }
    });
}

var show_fancy_box =()=>{

    $.fancybox.open($('[data-fancybox="images"]'), {
        margin: [44, 0, 22, 0],
        thumbs: {
            autoStart: true,
            axis: 'x'
        }
    });
    return false
};
if($('[data-fancybox="images"]').length > 0) {
    var main_fancy = $('[data-fancybox="images"]').fancybox({
        margin: [44, 0, 22, 0],
        thumbs: {
            autoStart: true,
            axis: 'x'
        }
    });
}

function Export2Doc(element, filename = ''){
    var preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
    var postHtml = "</body></html>";
    var html = preHtml+document.getElementById(element).innerHTML+postHtml;

    var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
    });

    // Specify link url
    var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);

    // Specify file name
    filename = filename?filename+'.doc':'document.doc';

    // Create download link element
    var downloadLink = document.createElement("a");

    document.body.appendChild(downloadLink);

    if(navigator.msSaveOrOpenBlob ){
        navigator.msSaveOrOpenBlob(blob, filename);
    }else{
        // Create a link to the file
        downloadLink.href = url;

        // Setting the file name
        downloadLink.download = filename;

        //triggering the function
        downloadLink.click();
    }

    document.body.removeChild(downloadLink);
}
//
function INPUT_NUMBER() {
    $('.input-type-number').on('input', function () {
        event.target.value = event.target.value.replace(/\D/g, '');
    });
    }

function updateTimer(time, dom) {
    var countDownDate = new Date(time).getTime();
// Update the count down every 1 second
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        document.getElementById(dom).innerHTML = "Còn " + days + " ngày " + hours + ":"
            + minutes + ":" + seconds + "";

        // If the count down is over, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementById(dom).innerHTML = "EXPIRED";
        }
    }, 1000);
}
//toggle
function togglesc(){
    $(document).ready(function(){
        $("button").click(function(){
            $("p").toggle();
        });
    });
}

function updateTimerSlide(time, dom) {
    var countDownDate = new Date(time).getTime();
// Update the count down every 1 second
    var x = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();

        // Find the distance between now and the count down date
        var distance = countDownDate - now;

        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Output the result in an element with id="demo"
        document.getElementsByClassName(dom)[0].innerHTML = "Còn " + days + " ngày " + hours + ":"
            + minutes + ":" + seconds + "";

        // If the count down is over, write some text
        if (distance < 0) {
            clearInterval(x);
            document.getElementsByClassName(dom)[0].innerHTML = "EXPIRED";
        }
    }, 1000);
}
//gg map api

function _FORMAT_MONEY(value) {
    let val = (value/1).toFixed(0).replace('.', ',');
    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")+' ₫';
}



