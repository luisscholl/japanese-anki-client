import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JapaneseNativeRecallComponent } from './japanese-native-recall.component';

describe('JapaneseNativeRecallComponent', () => {
  let component: JapaneseNativeRecallComponent;
  let fixture: ComponentFixture<JapaneseNativeRecallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JapaneseNativeRecallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JapaneseNativeRecallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
