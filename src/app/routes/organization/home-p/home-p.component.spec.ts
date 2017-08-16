import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePComponent } from './home-p.component';

describe('HomePComponent', () => {
  let component: HomePComponent;
  let fixture: ComponentFixture<HomePComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
