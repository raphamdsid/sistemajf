import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CadastroclienteComponent } from './cadastrocliente/cadastrocliente.component';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { FormBuilder, Validators } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { MatTabsModule } from '@angular/material/tabs';
import { HakuComponent } from './haku/haku.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastrodepComponent } from './cadastrodep/cadastrodep.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import { ConfiguracaoComponent } from './configuracao/configuracao.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ModaltitComponent } from './modaltit/modaltit.component';
import { ModalComponent } from './cadastrocliente/modal/modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { NgxCurrencyModule } from "ngx-currency";

import { AngularCreatePdfModule } from 'angular-create-pdf';
import { LOCALE_ID, DEFAULT_CURRENCY_CODE } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
//import { CarneComponent } from './cadastrocliente/carne/carne.component';
import { HttpClientModule } from '@angular/common/http';
import { ConsultaService } from './services/consulta.service';
import { ConsultaclientemodalComponent } from './cadastrocliente/consultaclientemodal/consultaclientemodal.component';
import { CadastrotypeComponent } from './cadastrotype/cadastrotype.component';
import { CadastrovendedorComponent } from './cadastrovendedor/cadastrovendedor.component';
import { ModalaComponent } from './financeiro/modala/modala.component';
import { ModalbComponent } from './financeiro/modalb/modalb.component';
import { AuthGuardService } from './auth/auth-guard.service';
import { AuthService } from './auth/auth.service';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ModalfinComponent } from './cadastrocliente/modalfin/modalfin.component';
import { ModalfinnComponent } from './financeiro/modalfin/modalfin.component';
import { ModalconfigComponent } from './configuracao/modalconfig/modalconfig.component';
import { JfvendaComponent } from './jfvenda/jfvenda.component';
import { ModaljfComponent } from './jfvenda/modaljf/modaljf.component'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { AdminmodalComponent } from './adminpanel/adminmodal/adminmodal.component';
import { ModalunidadeComponent } from './adminpanel/modalunidade/modalunidade.component';
import { EstornamodalComponent } from './consulta/estornamodal/estornamodal.component';
import { EditvendamodalComponent } from './consulta/editvendamodal/editvendamodal.component';
import { ConfirmeditvendamodalComponent } from './consulta/confirmeditvendamodal/confirmeditvendamodal.component';
import { ModalprodlistComponent } from './jfvenda/modalprodlist/modalprodlist.component';
import { MatInputModule } from '@angular/material/input';
import { ModalconfirmdescontoComponent } from './jfvenda/modalconfirmdesconto/modalconfirmdesconto.component';
import { SidenavComponent } from './sidenav/sidenav.component';
import { PrintrelComponent } from './relatorios/printrel/printrel.component';
import { ModaledittaxaComponent } from './adminpanel/modaledittaxa/modaledittaxa.component';
import { ModalentradaComponent } from './jfvenda/modalentrada/modalentrada.component';
import { ModalnewprodutoComponent } from './adminpanel/modalnewproduto/modalnewproduto.component';
import { ModaleditprodutoComponent } from './adminpanel/modaleditproduto/modaleditproduto.component';
import { ModaldelprodutoComponent } from './adminpanel/modaldelproduto/modaldelproduto.component';
import { ModalemergencialComponent } from './jfvenda/modalemergencial/modalemergencial.component';
import { ModalfornecedoresComponent } from './adminpanel/modalfornecedores/modalfornecedores.component';
import { ModalfinanciadorComponent } from './adminpanel/modalfinanciador/modalfinanciador.component';
import { ModalentradaconfComponent } from './adminpanel/modalentrada/modalentrada.component';
import { ModalconfirmjfvendaComponent } from './jfvenda/modalconfirmjfvenda/modalconfirmjfvenda.component';
import { ModalsolicitaestornoComponent } from './consulta/modalsolicitaestorno/modalsolicitaestorno.component';
import { ModalconfirmwaitdescontoComponent } from './adminpanel/modalconfirmwaitdesconto/modalconfirmwaitdesconto.component';
import { ModaldetailsjfComponent } from './consulta/modaldetailsjf/modaldetailsjf.component';
import { ModalprintrequerimentoComponent } from './consulta/modalprintrequerimento/modalprintrequerimento.component';
import { ModalbancoComponent } from './adminpanel/modalbanco/modalbanco.component';
import { ModalconfirmwaitestornoexComponent } from './adminpanel/modalconfirmwaitestornoex/modalconfirmwaitestornoex.component';
import { ModaldetailsexestornoComponent } from './adminpanel/modaldetailsexestorno/modaldetailsexestorno.component';
import { ModalconfirmwaitestornoespecialComponent } from './adminpanel/modalconfirmwaitestornoespecial/modalconfirmwaitestornoespecial.component';
import { ModalcontratojfComponent } from './jfvenda/modalcontratojf/modalcontratojf.component';
import { DocsComponent } from './docs/docs.component';
import { QRCodeModule } from 'angularx-qrcode';
import { OrdemservicoextComponent } from './ordemservicoext/ordemservicoext.component';
import { ConsultaproteseComponent } from './consultaprotese/consultaprotese.component';
import { RelatorioproteseComponent } from './relatorioprotese/relatorioprotese.component';
import { ModalconfirmordemservicoComponent } from './ordemservicoext/modalconfirmordemservico/modalconfirmordemservico.component';
import { ModallaboratorioComponent } from './adminpanel/modallaboratorio/modallaboratorio.component';
import { ModalosprodutosComponent } from './ordemservicoext/modalosprodutos/modalosprodutos.component';
import { ModalprodosComponent } from './adminpanel/modalprodos/modalprodos.component';
import { ModaldetailsosComponent } from './consultaprotese/modaldetailsos/modaldetailsos.component';
import { ModalupdateosComponent } from './consultaprotese/modalupdateos/modalupdateos.component';
import { ModaleditosComponent } from './consultaprotese/modaleditos/modaleditos.component';
import { ComunicadosComponent } from './comunicados/comunicados.component';
import { ScriptService } from './services/script.service.service';
import { NgxMercadopagoModule } from 'ngx-mercadopago';
import { ModalfpagComponent } from './financeiro/modalfpag/modalfpag.component';

registerLocaleData(localePt, 'pt');


const maskConfig: Partial<IConfig> = {
  validation: false,
};



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LayoutComponent,
    LoginComponent,
    CadastroclienteComponent,
    CadastrodepComponent,
    ConsultaComponent,
    FinanceiroComponent,
    RelatoriosComponent,
    ConfiguracaoComponent,
    ModaltitComponent,
    ModalComponent,
    ModalfinnComponent,
    //CarneComponent,
    ConsultaclientemodalComponent,
    CadastrotypeComponent,
    CadastrovendedorComponent,
    ModalaComponent,
    ModalbComponent,
    ModalconfigComponent,
    ModalfinComponent,
    JfvendaComponent,
    ModaljfComponent,
    SidemenuComponent,
    AdminpanelComponent,
    AdminmodalComponent,
    ModalunidadeComponent,
    EstornamodalComponent,
    EditvendamodalComponent,
    ConfirmeditvendamodalComponent,
    ModalprodlistComponent,
    ModalconfirmdescontoComponent,
    SidenavComponent,
    PrintrelComponent,
    HakuComponent,
    ModaledittaxaComponent,
    ModalentradaComponent,
    ModalnewprodutoComponent,
    ModaleditprodutoComponent,
    ModaldelprodutoComponent,
    ModalemergencialComponent,
    ModalfornecedoresComponent,
    ModalfinanciadorComponent,
    ModalentradaconfComponent,
    ModalconfirmjfvendaComponent,
    ModalsolicitaestornoComponent,
    ModalconfirmwaitdescontoComponent,
    ModaldetailsjfComponent,
    ModalprintrequerimentoComponent,
    ModalbancoComponent,
    ModalconfirmwaitestornoexComponent,
    ModaldetailsexestornoComponent,
    ModalconfirmwaitestornoespecialComponent,
    ModalcontratojfComponent,
    DocsComponent,
    OrdemservicoextComponent,
    ConsultaproteseComponent,
    RelatorioproteseComponent,
    ModalconfirmordemservicoComponent,
    ModallaboratorioComponent,
    ModalosprodutosComponent,
    ModalprodosComponent,
    ModaldetailsosComponent,
    ModalupdateosComponent,
    ModaleditosComponent,
    ComunicadosComponent,
    ModalfpagComponent

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    MatSliderModule,
    AngularCreatePdfModule,
    MatTabsModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatButtonModule,
    MatInputModule,
    QRCodeModule,
    MatIconModule,
    MatDividerModule,
    HttpClientModule,
    MatDialogModule,
    NgxCurrencyModule,
    AppRoutingModule,
    NgbModule,
    NgxMercadopagoModule.forRoot({
      publishKey: "TEST-5d21a6ef-6ec2-4520-9795-ed355329c1be",
      pathSDK: "./assets/Scripts/mp_sdk.js"
    }),
    NgxMaskModule.forRoot(maskConfig),
    BrowserAnimationsModule,
  ],

  // exports: [
  //   MatToolbarModule,
  //   MatSidenavModule,
  // ],

  providers: [

    DatePipe,
    { provide: Window, useValue: window },
    { provide: LocationStrategy, useClass: HashLocationStrategy },
    {
      provide: LOCALE_ID,
      useValue: 'pt'
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'BRL'
    },


    ConsultaService, AuthGuardService, AuthService, ScriptService
  ],
  bootstrap: [AppComponent]

})
export class AppModule { }
