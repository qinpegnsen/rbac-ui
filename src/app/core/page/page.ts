/**
 * 分页对象
 */
export class Page {
  curPage: number;
  lastPage: boolean;
  needCountQuery: boolean;
  pageSize: number;
  params: any;
  sortColumns: string;
  totalPage: number;
  totalRow: number;
  voList: any;

  public genStartRow(){
    return (this.curPage - 1) * this.pageSize + 1;
  }

  public genEndRow(){
    return this.curPage * this.pageSize;
  }
}
