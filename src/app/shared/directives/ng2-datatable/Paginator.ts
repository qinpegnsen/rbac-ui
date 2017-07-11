import {Component, Input, SimpleChange, OnChanges, Optional} from "@angular/core";
import {DataTable, PageEvent} from "./DataTable";

@Component({
    selector: "mfPaginator",
    template: `<ng-content></ng-content>`
})
export class Paginator implements OnChanges {

    @Input("mfTable") inputMfTable: DataTable;

    private mfTable: DataTable;

    public activePage: number;
    public rowsOnPage: number;
    public dataLength: number = 0;
    public lastPage: number;

    public constructor(@Optional() private injectMfTable: DataTable) {
    }

    public ngOnChanges(changes: {[key: string]: SimpleChange}): any {
        this.mfTable = this.inputMfTable || this.injectMfTable;
        console.log("changes",changes);
        this.onSubscriber(this.mfTable.getPage());
        this.mfTable.pageInit.subscribe(this.onSubscriber);
        this.mfTable.pageChange.subscribe(this.onSubscriber);
    }

    public setPage(pageNumber: number): void {
        this.mfTable.setPage(pageNumber, this.rowsOnPage);
    }

    public setRowsOnPage(rowsOnPage: number): void {
        this.mfTable.setPage(this.activePage, rowsOnPage);
    }

    private onSubscriber = (event: PageEvent)=> {
      console.log("event111",event);
        this.activePage = event.activePage;
        this.rowsOnPage = event.rowsOnPage;
        this.dataLength = event.dataLength;
        this.lastPage = Math.ceil(this.dataLength / this.rowsOnPage);
    };
}
