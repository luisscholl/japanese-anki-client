import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NativeJapaneseWritingComponent } from './native-japanese-writing.component';

describe('NativeJapaneseWritingComponent', () => {
  let component: NativeJapaneseWritingComponent;
  let fixture: ComponentFixture<NativeJapaneseWritingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NativeJapaneseWritingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NativeJapaneseWritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
