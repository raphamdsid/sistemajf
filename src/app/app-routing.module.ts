import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { CadastroclienteComponent } from './cadastrocliente/cadastrocliente.component';
// import { CadastrodepComponent } from './cadastrodep/cadastrodep.component';
import { ConfiguracaoComponent } from './configuracao/configuracao.component';
import { ConsultaComponent } from './consulta/consulta.component';
import { FinanceiroComponent } from './financeiro/financeiro.component';
import { HomeComponent } from './home/home.component';
import { LayoutComponent } from './layout/layout.component';
import { LoginComponent } from './login/login.component';
import { RelatoriosComponent } from './relatorios/relatorios.component';
import {
  AuthGuardService as AuthGuard
} from './auth/auth-guard.service';
// import { CarnesComponent } from './financeiro/carnes/carnes.component';
// import { CadastrovendedorComponent } from './cadastrovendedor/cadastrovendedor.component';
// import { CadastrotypeComponent } from './cadastrotype/cadastrotype.component';
import { HakuComponent } from './haku/haku.component';
// import { ContratoaComponent } from './financeiro/contratoa/contratoa.component';
import { guardedExpression } from '@angular/compiler/src/render3/util';
// import { ContratobComponent } from './financeiro/contratob/contratob.component';
// import { ComprovanteComponent } from './financeiro/comprovante/comprovante.component';
import { JfvendaComponent } from './jfvenda/jfvenda.component';
import { AdminpanelComponent } from './adminpanel/adminpanel.component';
import { PrintrelComponent } from './relatorios/printrel/printrel.component';
import { DocsComponent } from './docs/docs.component';
import { RelatorioproteseComponent } from './relatorioprotese/relatorioprotese.component';
import { ConsultaproteseComponent } from './consultaprotese/consultaprotese.component';
import { OrdemservicoextComponent } from './ordemservicoext/ordemservicoext.component';
import { ComunicadosComponent } from './comunicados/comunicados.component';
import { CrcComponent } from './crc/crc.component';
import { DelvenComponent } from './consulta/delven/delven.component';

const routes: Routes = [
  // { path: 'comprovantepagamento', component: ComprovanteComponent  },
  { path: 'relatorios/imprimir', component: PrintrelComponent },
  // { path: 'crctest', component: CrcComponent },
  { path: 'protese/:id', component: HakuComponent },
  // { path: 'testecontrato', component: ContratoaComponent  },
  // { path: 'testecontratob', component: ContratobComponent  },
  // { path: 'carne', component: CarnesComponent  },
  // { path: 'teste', component: HakuComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  // { path: 'test', component: CadastroclienteComponent },
  { path: 'delven', component: DelvenComponent },
  { path: 'login', component: LoginComponent },
  { path: 'haku', component: HakuComponent },
  {
    path: '', component: LayoutComponent, canActivate: [AuthGuard], children: [
      { path: 'consulta', component: ConsultaComponent },
      { path: 'adminpanel', component: AdminpanelComponent },
      { path: 'relatorios', component: RelatoriosComponent },
      { path: 'crc', component: CrcComponent },
      { path: 'relatorioprotese', component: RelatorioproteseComponent },
      { path: 'comunicados', component: ComunicadosComponent },
      { path: 'consultaprotese', component: ConsultaproteseComponent },
      { path: 'ordemservicolabext', component: OrdemservicoextComponent },
      { path: 'docs', component: DocsComponent },
      // { path: 'protese/:id', component: HakuComponent },
      { path: 'config', component: ConfiguracaoComponent },
      { path: 'financeiro', component: FinanceiroComponent },
      { path: 'jfvenda', component: JfvendaComponent },
      // { path: 'cadastrotype', pathMatch: 'full', component: CadastrotypeComponent },
      // { path: 'cadastrovendedor', component: CadastrovendedorComponent },
      // { path: 'cadastrocliente', component: CadastroclienteComponent },
      // { path: 'cadastrodep', component: CadastrodepComponent },
      { path: 'home', pathMatch: 'full', component: HomeComponent }]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
