import {Injectable} from '@angular/core';
declare var $: any;

@Injectable()
export class AjaxService {

  constructor() {
  }

  //get方式提交，一般用于查询
  public get(config) {
    if (!config) {
      console.log("ajax调用参数不能为空");
      return;
    }
    config.method = "get";  //设定提交方式为get
    this.post(config);   //执行ajax
  };

  //post方式提交，一般用于新增对象
  public post(config) {
    if (!config) {
      console.log("ajax调用参数不能为空");
      return;
    }
    var async = true, method = "post", dataType = 'json', maskIcon = 'ball-scale-ripple-multiple',
      width = $(window).width(), height = $(window).height();
    if (!config.hasOwnProperty('async')) config.async = async;
    if (!config.method) config.method = method;
    if (!config.dataType) config.dataType = dataType;
    if (!config.maskIcon) config.maskIcon = maskIcon; //遮罩层样式
    var loading = '<div id="showLoading" style="position: fixed;z-index:999;top: 0;left:0;width: ' + (width + 20) + 'px;height: ' + height + 'px;background-color:rgba(255,255,255,0.5);"><div class="' + config.maskIcon + '" style="margin: 0 auto;margin: ' + height / 2 + 'px 0px 0px ' + width / 2 + 'px"><div></div><div></div><div></div></div></div>'; //遮罩层

    //提交前显示遮罩层
    config.beforeSend = function (xhr) {
      //显示遮罩层
      if (config.mask === true) {
        // angular.element("body").append(loading); //初始化操作按钮（手机端），放入相应位置
      }
    };

    //设置全局ajax登录拦截
    var success = config.success;
    config.success = function (result, status, xhr) {
      //隐藏遮罩层
      // if (config.mask === true) angular.element("#showLoading").remove();
      //过滤登录
      if (xhr.getResponseHeader("serverError") || xhr.getResponseHeader("serverError") === "sessionOut") {
        // $state.go("page.login");
      } else {
        if (typeof success === "function") {
          success(result, status, xhr);
        }
      }
    };
    var error = config.error;
    config.error = function (result, status, xhr) {
      //隐藏遮罩层
      // if (config.mask === true) angular.element("#showLoading").remove();
      //回调
      if (typeof error === "function") {
        error(result, status, xhr);
      }
    };
    $.ajax(config);
  };

  //put方式提交，一般用于更新，会返回更新的所有信息
  public put(config) {
    if (!config) {
      console.log("ajax调用参数不能为空");
      return;
    }
    if (!config.data) {
      console.log("更新数据不能为空");
    }
    config.data._method = "put";
    this.post(config);   //执行ajax
  };

  //delete方式提交，用于删除
  public del(config) {
    if (!config) {
      console.log("ajax调用参数不能为空");
      return;
    }
    config.data._method = "delete";
    this.post(config);   //执行ajax
  };

  //patch方式提交，一般用于更新，会返回更新的部分信息
  public patch(config) {
    if (!config) {
      console.log("ajax调用参数不能为空");
      return;
    }
    config.data._method = "patch";
    this.post(config);   //执行ajax
  };
}
