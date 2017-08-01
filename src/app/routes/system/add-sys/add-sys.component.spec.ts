import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSysComponent } from './add-sys.component';

describe('AddSysComponent', () => {
  let component: AddSysComponent;
  let fixture: ComponentFixture<AddSysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
