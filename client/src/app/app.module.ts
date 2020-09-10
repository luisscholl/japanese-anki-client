import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { StudyComponent } from './components/study/study.component';
import { ManageComponent } from './components/manage/manage.component';
import { JapaneseNativeRecallComponent } from './components/japanese-native-recall/japanese-native-recall.component';
import { NativeJapaneseWritingComponent } from './components/native-japanese-writing/native-japanese-writing.component';
import { ManageCardComponent } from './components/manage-card/manage-card.component';
import { SettingsComponent } from './components/settings/settings.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CreditsComponent } from './components/credits/credits.component';
import { CharacterComponent } from './components/character/character.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    StudyComponent,
    ManageComponent,
    JapaneseNativeRecallComponent,
    NativeJapaneseWritingComponent,
    ManageCardComponent,
    SettingsComponent,
    CreditsComponent,
    CharacterComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
