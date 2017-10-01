import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RolesBindComponent } from './roles-bind.component';

describe('RolesBindComponent', () => {
  let component: RolesBindComponent;
  let fixture: ComponentFixture<RolesBindComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RolesBindComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesBindComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
