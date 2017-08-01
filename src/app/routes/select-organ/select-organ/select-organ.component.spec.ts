import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectOrganComponent } from './select-organ.component';

describe('SelectOrganComponent', () => {
  let component: SelectOrganComponent;
  let fixture: ComponentFixture<SelectOrganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectOrganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOrganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
