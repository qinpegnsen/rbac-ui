import { Component, OnInit } from '@angular/core';
import {SettingsService} from '../../../core/settings/settings.service';
import {ActivatedRoute,Router} from '@angular/router';
import {AjaxService} from "../../../core/services/ajax.service";
import { FileUploader } from 'ng2-file-upload';
import {LimitComponent} from "../limit/limit.component";
import {LimittabComponent} from "../limittab/limittab.component";
import {PatternService} from "../../../core/forms/pattern.service";
const swal = require('sweetalert');
const uploadUrl = "/limitFile/uploadLimitFile";  //图片上传路径(调取上传的接口)

@Component({
  selector: 'app-rightpage',
  templateUrl: './menuAdd.component.html',
  styleUrls: ['./menuAdd.component.scss'],
  providers: [SettingsService]
})

export class MenuAddComponent implements OnInit {
  public uploader:FileUploader = new FileUploader({
    url: uploadUrl,
    itemAlias:"limitFile",
    queueLimit: 1
  }); //初始化上传方法
  private queryId:number;//获取添加，修改的ID
  private uid;//声明保存获取到的暗码
  private menuList;//声明权限菜单列表
  private pageList;//声明页面菜单列表
  private menuCode;//声明保存上级的菜单编码
  private pageCode;//声明保存上级的页面编码
  private preType;//选择上级类型
  private limitForm = {
    menuCode:'',
    sysCode: '',
    menuName: '',
    menuUrl: '',
    preMenuCode: '',
    preCode:'',
    menuIcon: '',
    level: '',
    remarks: '',
    ord: ''
  }

  /**
   * 构造 初始化
   * **/
  constructor(private ajax:AjaxService, public settings:SettingsService, private router:Router, private routeInfo:ActivatedRoute, private route:ActivatedRoute, private limitComponent:LimitComponent, private limittabComponent:LimittabComponent,private patterns: PatternService) {
    this.settings.showRightPage("30%"); // 此方法必须调用！页面右侧显示，带滑动效果,可以自定义宽度：..%  或者 ..px
  }


  ngOnInit() {
    let _this = this;
    //获取路由的参数
    _this.queryId = _this.routeInfo.snapshot.queryParams['id'];
    _this.limitForm.sysCode = _this.routeInfo.snapshot.queryParams['sysCode'];
    _this.limitForm.preMenuCode = _this.routeInfo.snapshot.queryParams['menuCode'];
    _this.limitForm.menuCode = _this.routeInfo.snapshot.queryParams['menuCode'];
    _this.limitForm.preCode = _this.routeInfo.snapshot.queryParams['pageCode'];


    /**
     * 文件控制上传 获取暗码
     */
    _this.ajax.get({
      url: '/upload/basic/uid',
      success: (res) => {
        if (res.success) {
          _this.uid = res.data;//把获取的暗码赋值给uid
          //console.log('获取的暗码成功！', _this.uid);
          //_this.outputvalue.emit(true);//提交成功后向父组件传值
        } else {
          let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
          swal(res.info, errorMsg, 'error');
        }
      },
      error: (data) => {
        //swal('获得暗码失败','','error');
      }
    });

    /**
     *获取权限菜单列表的信息
     */
    _this.ajax.get({
      url: '/limitMenu/list',
      data: {
        'sysCode': _this.limitForm.sysCode
      },
      success: (data) => {
        _this.menuList = data;
      },
      error: (data) => {
        console.log("error");
      }
    });

  }

  /**
   * 查询上级的页面列表
   */
  prepagelist(menuCode){
    let _this = this;
    _this.menuCode = menuCode;

    /**
     *获取页面元素列表的信息
     */
    _this.ajax.get({
      url: '/limitPage/listpage',
      data: {
        'preCode': _this.menuCode
      },
      success: (data) => {
        _this.pageList = data;
      },
      error: (data) => {
        console.log("error");
      }
    });
  }

  /**
   * 关闭子页面（取消）
   */
  cancel() {
    let _this = this;
    _this.settings.closeRightPageAndRouteBack(); //关闭右侧滑动页面
  }

  /**
   * 添加（菜单、页面元素、功能操作、文件控制）
   * @param value 必填信息
   */
  addLimitList(value) {
    let _this = this;
    //添加页面元素列表
    if (_this.queryId == 2) {
      _this.ajax.post({
        url: '/limitPage/add',
        async: false,
        data: {
          'sysCode': _this.limitForm.sysCode,
          'menuCode':_this.limitForm.menuCode,
          'pageName': value.pageName,
          'icon': value.icon,
          'level': value.level,
          'remarks': value.remarks,
          'ord': value.ord
        },
        success: (res) => {
          if (res.success) {
            _this.router.navigate(['/main/limit'], {replaceUrl: true}); //路由跳转
            swal('添加页面元素提交成功！', '','success');
            _this.limitComponent.refresh()
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          swal('添加页面元素提交失败！', '','error');
        }
      })
    }
    //添加功能操作列表
    else if (_this.queryId == 4) {
      _this.ajax.post({
        url: '/limitOpt/add',
        async: false,
        data: {
          'sysCode': _this.limitForm.sysCode,
          'optName': value.optName,
          'tacklUrl': value.tacklUrl,
          'menuCode': _this.menuCode,
          'ord': value.ord,
          'remarks': value.remarks,
          'preType':this.preType
        },
        success: (res) => {
          console.log(res)
          if (res.success) {
            _this.router.navigate(['/main/limit'], {replaceUrl: true});   //路由跳转
            swal('添加功能操作提交成功！', '','success');
            //_this.outputvalue.emit(true);//提交成功后向父组件传值
            _this.limitComponent.refresh();
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (data) => {
          swal('添加页面元素提交失败！', '','error');
        }
      });
    }
    //添加文件控制列表
    else if (_this.queryId == 6) {

      /**
       * 构建form时，传入自定义参数
       * @param item
       */
      _this.uploader.onBuildItemForm = function(fileItem, form){
        form.append('fileuuid', _this.uid);
      };

      /**
       * 上传成功处理
       * @param item 成功的文件列表
       * @param response 返回信息
       * @param status 状态码
       * @param headers 上传成功后服务器的返回的返回头
       */
      _this.uploader.onSuccessItem = function (item, response, status, headers) {
        let res = JSON.parse(response);
        if (res.success) {
          /**
           * 上传文件成功，保存数据库
           */
          _this.ajax.post({
            url: '/limitFile/add',
            async: false,
            data: {
              'sysCode': _this.limitForm.sysCode,
              'fileName': value.fileName,
              'fileuuid': _this.uid
            },
            success: (res) => {
              if (res.success) {
                _this.router.navigate(['/main/limit'], {replaceUrl: true}); //路由跳转
                swal('文件添加提交成功！', '列表已自动更新...', 'success');
                _this.limitComponent.refresh();
                //_this.outputvalue.emit(true);//提交成功后向父组件传值
              } else {
                swal(res.info, "上传文件成功，但保存信息失败！", 'error');
              }
            },
            error: (data) => {
              swal(res.info, "上传文件成功，但保存信息失败！", 'error');
            }
          });
        } else {
          swal('上传失败', '文件上传失败！', 'error');
        }
      };
      /**
       * 上传失败处理
       * @param item 失败的文件列表
       * @param response 返回信息
       * @param status 状态码
       * @param headers 上传失败后服务器的返回的返回头
       */
       _this.uploader.onErrorItem = function (item, response, status, headers) {
        swal('上传失败', '文件上传失败！', 'error');
      };
      /**
       * 执行上传
       */
      _this.uploader.uploadAll();

    }
    //添加权限菜单的子集
    else if(_this.queryId == 7){
      let submitUrl = '/limitMenu/add';
      _this.ajax.post({
        url: submitUrl,
        async: false,
        data: _this.limitForm,
        success: (res) => {
          if (res.success) {
            _this.router.navigate(['/main/limit'], {replaceUrl: true}); //路由跳转
            swal('添加菜单提交成功！', '','success');
            //_this.outputvalue.emit(true);//提交成功后向父组件传值
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (res) => {
          swal('添加菜单提交失败！','', 'error');
        }
      })
      _this.limitComponent.queryDatas();
    }
    //添加页面元素的子集
    else if(_this.queryId == 8){
      let submitUrl = '/limitPage/add';
      _this.ajax.post({
        url: submitUrl,
        async: false,
        data: {
          'sysCode': _this.limitForm.sysCode,
          'pageName': value.pageName,
          'preCode': _this.limitForm.preCode,
          'icon': value.icon,
          'level': value.level,
          'remarks': value.remarks,
          'ord': value.ord
        },
        success: (res) => {
          if (res.success) {
            _this.router.navigate(['/main/limit'], {replaceUrl: true}); //路由跳转
            swal('添加菜单提交成功！', '','success');
            //_this.outputvalue.emit(true);//提交成功后向父组件传值
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (res) => {
          swal('添加菜单提交失败！','', 'error');
        }
      })
      _this.limitComponent.queryDatas();
    }
    //添加菜单
    else {
      let submitUrl = '/limitMenu/add';
      _this.ajax.post({
        url: submitUrl,
        async: false,
        data: _this.limitForm,
        success: (res) => {
          if (res.success) {
            _this.router.navigate(['/main/limit'], {replaceUrl: true}); //路由跳转
            swal('添加菜单提交成功！', '','success');
            //_this.outputvalue.emit(true);//提交成功后向父组件传值
          } else {
            let errorMsg = res.data.substring(res.data.indexOf('$$') + 2, res.data.indexOf('@@'))
            swal(res.info, errorMsg, 'error');
          }
        },
        error: (res) => {
          swal('添加菜单提交失败！','', 'error');
        }
      })
      _this.limitComponent.queryDatas();
    }

  }
  //获取到当前的菜单的编码
  //获取到子组件发射过来的菜单编码
  getMenuData(menuCode){
    this.menuCode=menuCode;
    console.log(menuCode)
  }

  //获取到当前的页面的编码
  getPageData(pageCode){
    this.pageCode=pageCode;
    console.log(this.pageCode)
  }
}
