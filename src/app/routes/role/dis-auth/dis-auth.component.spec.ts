import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DisAuthComponent } from './dis-auth.component';

describe('DisAuthComponent', () => {
  let component: DisAuthComponent;
  let fixture: ComponentFixture<DisAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DisAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DisAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
