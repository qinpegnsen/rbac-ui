import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddorganComponent } from './addorgan.component';

describe('AddorganComponent', () => {
  let component: AddorganComponent;
  let fixture: ComponentFixture<AddorganComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddorganComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddorganComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
