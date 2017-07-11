import {
    Directive, Input, EventEmitter, SimpleChange, OnChanges, DoCheck, IterableDiffers,
    IterableDiffer, Output
} from "@angular/core";
import * as _ from "lodash";
import {ReplaySubject} from "rxjs/Rx";

export interface SortEvent {
    sortBy: string|string[];
    sortOrder: string
}

export interface PageEvent {
    event: string;
    activePage: number;
    rowsOnPage: number;
    dataLength: number;
}

export interface DataEvent {
    length: number;
}

@Directive({
    selector: 'table[mfData]',
    exportAs: 'mfDataTable'
})
export class DataTable implements OnChanges{

    private diff: IterableDiffer<any>;
    @Input("mfData") public inputData: any[] = [];
    @Input("mfTotalRow") public totalRow: number = 0;


    @Input("mfSortBy") public sortBy: string|string[] = "";
    @Input("mfSortOrder") public sortOrder = "asc";
    @Output("mfSortByChange") public sortByChange = new EventEmitter<string|string[]>();
    @Output("mfSortOrderChange") public sortOrderChange = new EventEmitter<string>();
    @Output("mfPageChange") public pageChange = new EventEmitter<PageEvent>();

    @Input("mfRowsOnPage") public rowsOnPage = 1000;
    @Input("mfActivePage") public activePage = 1;

    private mustRecalculateData = false;

    public data: any[];

    public onSortChange = new ReplaySubject<SortEvent>(1);
    public pageInit = new EventEmitter<PageEvent>();

    public constructor(private differs: IterableDiffers) {
        this.diff = differs.find([]).create(null);
    }

    public getSort(): SortEvent {
        return {sortBy: this.sortBy, sortOrder: this.sortOrder};
    }

    public setSort(sortBy: string|string[], sortOrder: string): void {
        if (this.sortBy !== sortBy || this.sortOrder !== sortOrder) {
            this.sortBy = sortBy;
            this.sortOrder = _.includes(["asc","desc"], sortOrder) ? sortOrder : "asc";
            this.mustRecalculateData = true;
            this.onSortChange.next({sortBy: sortBy, sortOrder: sortOrder});
            this.sortByChange.emit(this.sortBy);
            this.sortOrderChange.emit(this.sortOrder);
        }
    }

    public getPage(): PageEvent {
        return {event:'getpage',activePage: this.activePage, rowsOnPage: this.rowsOnPage, dataLength: this.totalRow};
    }

    public setPage(activePage: number, rowsOnPage: number): void {
      console.log("setPage执行",this.rowsOnPage,rowsOnPage,this.activePage,activePage);
        if (this.rowsOnPage !== rowsOnPage || this.activePage !== activePage) {
            if(isNaN(activePage)){
                this.activePage = 1;
            }else{
                this.activePage = this.activePage !== activePage ? activePage : this.calculateNewActivePage(this.rowsOnPage, rowsOnPage);
            }
            this.rowsOnPage = rowsOnPage;
            console.log("activePage",this.activePage);

          console.log("this.mfTable.pageInit",this.pageInit);
          console.log("this.mfTable.onPageChange",this.pageChange);
            this.pageChange.emit({
              event:"pageChange",
              activePage: this.activePage,
              rowsOnPage: this.rowsOnPage,
              dataLength: this.totalRow
            });
        }
        this.data = this.inputData;
    }

    private calculateNewActivePage(previousRowsOnPage: number, currentRowsOnPage: number): number {
        let firstRowOnPage = (this.activePage - 1) * previousRowsOnPage + 1;
        let newActivePage = Math.ceil(firstRowOnPage / currentRowsOnPage);
        // return isNaN(newActivePage)?1:newActivePage;
      return newActivePage;
    }

    private recalculatePage() {

        let lastPage = Math.ceil(this.totalRow / this.rowsOnPage);
        this.activePage = lastPage < this.activePage ? lastPage : this.activePage;
        this.activePage = this.activePage || 1;

        this.pageInit.emit({
            event:"pageInit",
            activePage: this.activePage,
            rowsOnPage: this.rowsOnPage,
            dataLength: this.totalRow
        });
        this.data = this.inputData;
    }

    public ngOnChanges(changes: {[key: string]: SimpleChange}): any {
        if (changes["rowsOnPage"]) {
              if(typeof changes["rowsOnPage"].previousValue !=="undefined"){
                this.rowsOnPage = changes["rowsOnPage"].previousValue;
                this.setPage(this.activePage, changes["rowsOnPage"].currentValue);
              }
        }

        if (changes["sortBy"] || changes["sortOrder"]) {
            if (!_.includes(["asc", "desc"], this.sortOrder)) {
                console.warn("angular2-datatable: value for input mfSortOrder must be one of ['asc', 'desc'], but is:", this.sortOrder);
                this.sortOrder = "asc";
            }
            if (this.sortBy) {
                this.onSortChange.next({sortBy: this.sortBy, sortOrder: this.sortOrder});
            }
            this.mustRecalculateData = true;
        }
        if (changes["inputData"]) {
            if(!changes["inputData"].firstChange){
                this.inputData = changes["inputData"].currentValue || [];
                this.recalculatePage();
            }
        }
    }

    private fillData(): void {
        this.activePage = this.activePage;
        this.rowsOnPage = this.rowsOnPage;

        let offset = (this.activePage - 1) * this.rowsOnPage;
        let data = this.inputData;
        var sortBy = this.sortBy;
        if (typeof sortBy === 'string' || sortBy instanceof String) {
            data = _.orderBy(data, this.caseInsensitiveIteratee(<string>sortBy), [this.sortOrder]);
        } else {
            data = _.orderBy(data, sortBy, [this.sortOrder]);
        }
        data = _.slice(data, offset, offset + this.rowsOnPage);
        this.data = data;
    }

    private caseInsensitiveIteratee(sortBy: string) {
        return (row: any): any => {
            var value = row;
            for (let sortByProperty of sortBy.split('.')) {
                if(value) {
                    value = value[sortByProperty];
                }
            }
            if (value && typeof value === 'string' || value instanceof String) {
                return value.toLowerCase();
            }
            return value;
        };
    }
}
