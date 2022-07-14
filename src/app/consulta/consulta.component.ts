import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ControlContainer, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import jspdf, { jsPDF, jsPDFOptions } from 'jspdf';
import { ConsultaService } from '../services/consulta.service';
import jwt_decode from "jwt-decode";
import { formatCurrency, TitleCasePipe } from '@angular/common';
import * as html2canvas from 'html2canvas';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { BuscaCepService } from '../services/buscacep.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { formatDate } from '@angular/common';
import { ModalbComponent } from '../financeiro/modalb/modalb.component';
import { EstornamodalComponent } from './estornamodal/estornamodal.component';
import { EditvendamodalComponent } from './editvendamodal/editvendamodal.component';
import { ConfirmeditvendamodalComponent } from './confirmeditvendamodal/confirmeditvendamodal.component';
import { DelvenComponent } from './delven/delven.component';
import { ModalsolicitaestornoComponent } from './modalsolicitaestorno/modalsolicitaestorno.component';
import { ModaldetailsjfComponent } from './modaldetailsjf/modaldetailsjf.component';
import { ModalprintrequerimentoComponent } from './modalprintrequerimento/modalprintrequerimento.component';
import { ModalcontratojfComponent } from '../jfvenda/modalcontratojf/modalcontratojf.component';
import { ModaldetailsosComponent } from '../consultaprotese/modaldetailsos/modaldetailsos.component';
import { ToolsService } from '../services/tools.service';
import { ModalComponent } from '../modal/modal.component';



@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {


  userForm: FormGroup;
  vendedorForm: any;
  selectedOption: string = '';
  printedOption: string = '';
  plano: string = '';
  valorparcela: number = 0;
  adesao: number = 0;
  priparcela: number = 0;
  descontos: number = 1;
  desconto: number = 100;
  parcelcontrol: number = 0;
  gerentectrl: number = 0;
  valordesconto: number = 0;
  pdfshow: number = 0;
  tipocontrato: number = 0;
  nomeplano: string = '';
  finbaenable: number = 0;
  finbbenable: number = 0;
  dep1: any = '';
  dep2: any = '';
  dep3: any = '';
  dep4: any = '';
  formobj: any = null;
  buscaclientecpf: String = '';
  objbusca: any = [];
  enabletitba: Number = 1;
  enabletitbb: Number = 1;
  enabletitbc: Number = 1;
  operacao: Number = 0;
  objbuscac: any = [];
  objbuscav: any = [];
  sloader: any = 0;

  options = [
    { name: "option1", value: 1 },
    { name: "option2", value: 2 }
  ]



  hidedescontos: number = 1;
  depbtnenable: number = 0;
  // depaddenable: number = 0;
  parcela: number = 1;
  valortot: number = 0;
  depNome: string = '';
  depCpf: string = '';
  depRg: string = '';
  depOrg: string = '';
  depNasc: any = '';
  depGen: string = '';
  dependentesx: any;
  testpage: string = '';
  titNome: string = '';
  tNome: string = '';
  tabindex: number = 0;
  valorf: Number = 0;
  valorft: Number = 0;
  valorparcelaf: any = 0;
  showcarne: Number = 0;
  public enabletitb: number = 1;
  public validtit: number = 0;
  public showdeplist: number = 0;
  dependentes: any;


  depForm: any;
  profileForm: any;

  tcontrato: number = 0;
  enabletitinc: number = 0;
  opag: any;
  showcartao: number = 0;
  objcliente: any;
  cep: any;
  objcep: any = [];
  depaddenable: number = 1;
  objdepedit: any;
  depsaveenable: number = 1;
  depeditenable: number = 1;
  depobj: any;
  editid: any;

  foundcliente: any;
  objvendedor: any = [];
  role: any;
  user: any;
  buscaForm: any;
  today: any;
  thisday: any;
  vendalist: any = [];
  showcomp: any = 0;
  compindex: any;
  pwd: any;
  valtotvendas: number = 0;
  countvendas: number = 0;
  valor: any;
  financiadores: any = [];
  buscaProteseExForm: any;
  ordemlist: any = [];
  showlabinput: number = 0;
  laboratorios: any = [];
  unidlist: any = [];
  constructor(private tools: ToolsService, private router: Router, private formBuilder: FormBuilder, public dialog: MatDialog, private service: ConsultaService, private http: HttpClient,
    private cepService: BuscaCepService, private auth: AuthService) {
    this.userForm = this.formBuilder.group({
    });
  }

  ngOnInit(): void {
    this.auth.isAuth();
    this.getSessionItem();
    let unitemp: any = [];
    this.tools.unidList().subscribe(data => {
      for (let x = 0; x < data.length; x++) {
        if (data[x].ativo == 1) {
          this.unidlist.push(data[x]);
        }
      }
    });
    // unitemp = JSON.parse(JSON.stringify(unitemp));
    console.log(unitemp);
    console.log(this.unidlist);
    let today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.today = today;
    let thisday = new Date();
    this.thisday = thisday;
    console.log(today);
    console.log(this.today);
    this.service.getFinanciadores().subscribe(f => {
      console.log(f)
      this.financiadores = f;
    });
    this.service.getLaboratorios().subscribe(f => {
      console.log(f)
      this.laboratorios = f;
    });

    this.buscaForm = new FormGroup({
      dtinicio: new FormControl(today, Validators.required),
      dtfim: new FormControl(today, Validators.required),
      valinicio: new FormControl(''),
      valfim: new FormControl(''),
      cpf: new FormControl(''),
      unidade: new FormControl('todas'),
      financiador: new FormControl('todos'),
      isvendedor: new FormControl(false),
      buscavendedor: new FormControl('', Validators.required)
    });

    this.buscaProteseExForm = new FormGroup({
      dtinicio: new FormControl(today, Validators.required),
      dtfim: new FormControl(today, Validators.required),
      laboratorio: new FormControl('todos'),
      labinput: new FormControl(''),
      typesearch: new FormControl(false),
      cpf: new FormControl(''),
      documento: new FormControl(''),
      nos: new FormControl(''),
      unidade: new FormControl('todas')
    });


    this.profileForm = new FormGroup({
      buscacliente: new FormControl(''),
      origemvenda: new FormControl('', Validators.required),
      vendedor: new FormControl('', Validators.required),
      unidade: new FormControl('', Validators.required),
      titularnome: new FormControl(''),
      titularcpf: new FormControl(''),
      titularrg: new FormControl(''),
      titularorgao: new FormControl(''),
      titularnasc: new FormControl(''),
      titulargen: new FormControl(''),
      titularemail: new FormControl(''),
      titularcel: new FormControl(''),
      titulartel: new FormControl(''),
      titularendereco: new FormControl(''),
      titularcep: new FormControl(''),
      titularnum: new FormControl(''),
      titularcomp: new FormControl(''),
      titularbairro: new FormControl(''),
      titularcidade: new FormControl(''),
      titularestado: new FormControl(''),
      titularwhatsapp: new FormControl(false)
    });

    this.vendedorForm = new FormGroup({
      vendedornome: new FormControl('', Validators.required),
      vendedorcpf: new FormControl('', Validators.required),
      vendedorrg: new FormControl('', Validators.required),
      vendedornasc: new FormControl('', Validators.required),
      vendedoradmissao: new FormControl('', Validators.required),
      buscavendedor: new FormControl('', Validators.required)
    });


    // this.profileForm.disable();
    // this.vendedorForm.disable();
    // console.log("Obj Vendedor: " + this.objvendedor);

    // this.service.getVendedor().subscribe(c => {
    //   this.objvendedor = c;
    // //   console.log("Obj Vendedor: ", this.objvendedor);


    // });
    // console.log("Obj Cliente: " + this.objcliente);

    // this.service.getCliente().subscribe(c => {
    //   this.objcliente = c;
    // //   console.log("Obj Cliente: ", this.objcliente);

    // },
    //   (e) => {

    //     this.objcliente = {
    //       nome: ''
    //     }
    //   });
    // this.enabletitb = 1;
    // this.showdeplist = 0;
    // this.dependentes.shift();
    // this.depForm.disable();

    // this.depbtnenable = 0;

  }
  logout() {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("login");
    sessionStorage.removeItem("role");
    this.router.navigate(['/login']);
  }

  showComprovante(show: any, index: any) {
    this.showcomp = show;
    this.compindex = index;
  }

  showContent() {
    alert("Working!");
  }
  menuNavigate(path: any) {
    if (path == 'venda') {
      this.router.navigate(['/financeiro']);
    }
    if (path == 'consulta') {
      this.router.navigate(['/consulta']);
    }
    if (path == 'jf') {
      this.router.navigate(['/jfvenda']);
    }

  }
  inputLab() {
    if (this.buscaProteseExForm.controls["laboratorio"].value == 'outro') {
      this.showlabinput = 1;
    }
    else {
      this.showlabinput = 0;
    }
  }
  searchParamsProtEx() {
    let laboratorio;
    let tlab;
    let dta = this.buscaProteseExForm.controls["dtinicio"].value;
    let dtb = this.buscaProteseExForm.controls["dtfim"].value;
    let cpf;
    let unidade;

    if (this.buscaProteseExForm.controls["laboratorio"].value == 'todos') {
      laboratorio = null;
      tlab = '';
    }

    if (this.buscaProteseExForm.controls["laboratorio"].value == 'outro') {
      laboratorio = this.buscaProteseExForm.controls["labinput"].value;
      tlab = 1;
    }

    if (this.buscaProteseExForm.controls["laboratorio"].value != 'outro' && this.buscaProteseExForm.controls["laboratorio"].value != 'todos') {
      laboratorio = this.buscaProteseExForm.controls["laboratorio"].value;
      tlab = 0;
    }

    if (this.buscaProteseExForm.controls["cpf"].value != '' && this.buscaProteseExForm.controls["cpf"].value != null) {
      cpf = this.buscaProteseExForm.controls["cpf"].value;
    }
    else {
      cpf = null;
    }
    if (this.buscaProteseExForm.controls["unidade"].value != '' && this.buscaProteseExForm.controls["unidade"].value != null && this.buscaProteseExForm.controls["unidade"].value != "todas") {
      unidade = this.buscaProteseExForm.controls["unidade"].value;
    }
    else {
      unidade = null;
    }

    let params = {
      dta: dta,
      dtb: dtb,
      // tipodata: 'cadastro',
      laboratorio: laboratorio,
      tlab: tlab,
      cpf: cpf,
      unidade: unidade
    }
    return params;
  }

  getOs() {
    this.ordemlist = [];
    let tipobusca = this.buscaProteseExForm.controls["typesearch"].value;
    if (tipobusca == false) {
      if (this.buscaProteseExForm.valid == true) {
        this.sloader = 1;
        const obj = this.searchParamsProtEx();
        this.service.postOrdemDeServicoReadM(obj).subscribe(o => {
          console.log(o);
          this.ordemlist = o.ordens;
          console.log(this.ordemlist);
          this.sloader = 0;
        },
          (error) => {
            console.log(error);
            this.ordemlist = [];
            this.sloader = 0;
          });
      }
      else {
        alert("Defina as datas da busca");
      }
    }
    if (tipobusca == true) {
      this.sloader = 1;
      const obj = {
        id: this.buscaProteseExForm.controls["nos"].value
      }
      this.service.postOrdemDeServicoReadS(obj).subscribe(o => {
        console.log(o);
        this.ordemlist = o.ordens;
        console.log(this.ordemlist);
        this.sloader = 0;
      },
        (error) => {
          console.log(error);
          this.ordemlist = [];
          this.sloader = 0;
        });
    }
  }

  detailsOs(index: any) {
    let ordem = this.ordemlist[index];
    const dialogRef = this.dialog.open(ModaldetailsosComponent, {
      data: {
        ordem: ordem
      },
      panelClass: 'modaldetails'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }

  editVenda(i: any) {
    let obj = this.vendalist[i];
    let objdate = new Date(obj.createdat);
    console.log(objdate);
    let objdia = objdate.getDate();
    let objmes = objdate.getMonth() + 1;
    let ano = objdate.getFullYear();
    let objhora = objdate.getHours();
    let objminutos = objdate.getMinutes();
    let dia = ('0' + objdia).slice(-2);
    let mes = ('0' + objmes).slice(-2);
    let hora = ('0' + objhora).slice(-2);
    let minutos = ('0' + objminutos).slice(-2);
    let datastring = String(ano + '-' + mes + '-' + dia);
    let horastring = String(hora + ':' + minutos);
    obj.createdatdate = datastring;
    obj.createdathour = horastring;
    const dialogRefa = this.dialog.open(EditvendamodalComponent, {

      data: {
        cliente: obj.cliente,
        fiador: obj.fiador,
        cpffiador: obj.cpffiador,
        cpfpaciente: obj.cpfpaciente,
        createdatdate: obj.createdatdate,
        createdathour: obj.createdathour,
        createdby: obj.createdby,
        docfinanceiro: obj.docfinanceiro,
        docodc: obj.docodc,
        parcela: obj.parcela,
        financiador: obj.financiador,
        id: obj.id,
        isnotfiador: obj.isnotfiador,
        stats: obj.stats,
        unidade: obj.unidade,
        updatedat: obj.updatedat,
        valortotal: obj.valortotal,
        valoratual: obj.valoratual,
        valorestorno: obj.valorestorno,
        financiadores: this.financiadores
      },
      panelClass: 'editvendamodal'
    });
    dialogRefa.afterClosed().subscribe(resulta => {
      // console.log(obj);
      if (resulta) {
        console.log(resulta);
        let oldentry = resulta.original;
        let newentry = resulta.new;
        let modaltxtb = 'Digite sua senha para confirmar a edição da venda';
        const dialogRefb = this.dialog.open(ConfirmeditvendamodalComponent, {
          data: {
            newentry: newentry,
            oldentry: oldentry,
            modaltxt: modaltxtb
          },
          panelClass: 'editvendamodal'
        });
        dialogRefb.afterClosed().subscribe(resultb => {
          if (resultb) {
            this.showLoader(true);
            console.log(resultb);
            let user = resultb.user;
            let obj = resultb.obj;
            let oldobj = resultb.objb;
            let txtold: any;
            let txtnew: any;
            // let parcelatxt: any;
            // let oldparcelatxt: any;

            // if (oldobj.parcela == 1) {
            //   oldparcelatxt = "" + oldobj.parcela + " parcela";
            // }
            // if (oldobj.parcela > 1) {
            //   oldparcelatxt = "" + oldobj.parcela + " parcelas";
            // }
            // if (obj.parcela == 1) {
            //   parcelatxt = "" + obj.parcela + " parcela";
            // }
            // if (obj.parcela > 1) {
            //   parcelatxt = "" + obj.parcela + " parcelas";
            // }
            if (oldobj.isnotfiador == 0) {
              txtold = "Paciente: " + oldobj.cliente + " - sem fiador, CPF: " + oldobj.cpffiador + " - Financiador: " + oldobj.financiador + " - DOC Financeiro: " + oldobj.docfinanceiro + " - DOC ODC: " + oldobj.docodc + " - Data: " + oldobj.createdatdate + " - Hora: " + oldobj.createdathour;
            }
            if (oldobj.isnotfiador == 1) {
              txtold = "Paciente: " + oldobj.cliente + " - CPF Paciente: " + oldobj.cpfpaciente + "Fiador: " + oldobj.fiador + " - CPF Fiador: " + oldobj.cpffiador + " - Financiador: " + oldobj.financiador + " - DOC Financeiro: " + oldobj.docfinanceiro + " - DOC ODC: " + oldobj.docodc + " - Data: " + oldobj.createdatdate + " - Hora: " + oldobj.createdathour;
            }
            if (obj.isnotfiador == 0) {
              txtnew = "Paciente: " + obj.cliente + " - sem fiador, CPF: " + obj.cpffiador + " - Financiador: " + obj.financiador + " - DOC Financeiro: " + obj.docfinanceiro + " - DOC ODC: " + obj.docodc + " - Data: " + obj.createdatdate + " - Hora: " + obj.createdathour;
            }
            if (obj.isnotfiador == 1) {
              txtnew = "Paciente: " + obj.cliente + " - CPF Paciente: " + obj.cpfpaciente + "Fiador: " + obj.fiador + " - CPF Fiador: " + obj.cpffiador + " - Financiador: " + obj.financiador + " - DOC Financeiro: " + obj.docfinanceiro + " - DOC ODC: " + obj.docodc + " - Data: " + obj.createdatdate + " - Hora: " + obj.createdathour;
            }

            let auditobj = 'Venda';
            let auditoperacao = 'Edição';
            let audittxt = "Edição de dados de venda de [" + txtold + "] para [" + txtnew + "]"
            const editobj = {
              id: obj.id,
              cliente: obj.cliente,
              fiador: obj.fiador,
              isnotfiador: obj.isnotfiador,
              cpffiador: obj.cpffiador,
              cpfpaciente: obj.cpfpaciente,
              financiador: obj.financiador,
              // parcela: obj.parcela,
              docodc: obj.docodc,
              docfinanceiro: obj.docfinanceiro,
              createdat: obj.createdatdate + " " + obj.createdathour + ":00",
              user: user,
              auditobj: auditobj,
              auditoperacao: auditoperacao,
              audittxt: audittxt
            }
            this.service.editVenda(editobj).subscribe(async c => {
              console.log(c);
              if (c.status == '200') {
                await this.showLoader(false);
                // console.log('funcionou');
                this.vendalist[i].cliente = editobj.cliente;
                this.vendalist[i].fiador = editobj.fiador;
                this.vendalist[i].isnotfiador = editobj.isnotfiador;
                this.vendalist[i].financiador = editobj.financiador;
                this.vendalist[i].cpffiador = editobj.cpffiador;
                this.vendalist[i].cpfpaciente = editobj.cpfpaciente;
                this.vendalist[i].docodc = editobj.docodc;
                this.vendalist[i].docfinanceiro = editobj.docfinanceiro;
                this.vendalist[i].createdat = editobj.createdat;
                await this.delay(25);
                alert("Venda editada");
              }

              if (c.status != '200') {
                // console.log('nao funcionou erro cad venda');
                this.sloader = 0;
                alert("Erro ao editar venda");
              }

            });
          }
        });
      }
    });
  }
  deletaVenda(index: any) {
    const dialogRef = this.dialog.open(ModalComponent, {
      data: {
        tipo: 'delvenda',
        obj: this.vendalist[index]
      },
      panelClass: 'modalestorno'
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
  cancelaEstorno(index: any) {
    if (this.vendalist[index].waitestornostatus == 0) {
      let id = this.vendalist[index].id;
      let stats: any;
      let audittxt: any;
      let tipo: any;
      let auditobj = 'Venda';
      let auditoperacao: any;
      let venda = {
        cliente: this.vendalist[index].cliente,
        fiador: this.vendalist[index].fiador,
        cpffiador: this.vendalist[index].cpffiador,
        cpfpaciente: this.vendalist[index].cpfpaciente,
        createdat: this.vendalist[index].createdat,
        createdby: this.vendalist[index].createdby,
        docfinanceiro: this.vendalist[index].docfinanceiro,
        docodc: this.vendalist[index].docodc,
        financiador: this.vendalist[index].financiador,
        id: this.vendalist[index].id,
        isnotfiador: this.vendalist[index].isnotfiador,
        stats: this.vendalist[index].stats,
        unidade: this.vendalist[index].unidade,
        updatedat: this.vendalist[index].updatedat,
        valoratual: this.vendalist[index].valoratual,
        valorestorno: this.vendalist[index].valorestorno,
        valortotal: this.vendalist[index].valortotal
      }
      //let objvenda = this.vendalist[index];
      console.log(this.vendalist[index]);
      // //console.log(venda);
      let inf = "CPF: " + venda.cpffiador;
      let modaltxtb: any;
      let modaltxta = "Insira o valor a ser estornado";
      let valor;
      let valoratual = venda.valortotal;
      let valorestorno = 0;
      console.log(venda);

      stats = 'ativo';
      auditoperacao = 'Cancel. estorno';
      modaltxtb = 'Insira sua senha para cancelar o estorno desta venda';
      audittxt = "Cancelamento de estorno. Cliente: " + venda.fiador + " " + inf + ". Valor total da venda: " + formatCurrency(Number(venda.valortotal), 'pt-BR', 'R$') + " - Valor atual " + formatCurrency(Number(valoratual), 'pt-BR', 'R$') + " - Valor estornado " + formatCurrency(Number(0), 'pt-BR', 'R$') + " - financiador: " + venda.financiador + " - data da venda: " + formatDate(venda.createdat, 'dd/MM/yyyy', 'pt-BR') + " - Doc Financeiro: " + venda.docfinanceiro + " - Doc ODC: " + venda.docodc + "";



      const dialogRef = this.dialog.open(ModalbComponent, {
        data: {
          pass: this.pwd,
          modaltxt: modaltxtb
        },
        panelClass: 'simplemodal'
      });

      dialogRef.afterClosed().subscribe(result => {

        const username = this.auth.getUser();
        //this.sloader = 1;
        if (result) {
          this.sloader = 1;
        }
        this.service.getUser(username).subscribe(u => {
          let user = u;
          console.log(username);
          // console.log(user);

          if (result == user.pwd) {
            //          this.sloader = 1;
            const obj = {
              id: id,
              stats: stats,
              valoratual: valoratual,
              valorestorno: valorestorno,
              audittxt: audittxt,
              user: this.user.username,
              //unidade: this.user.unidade,
              auditoperacao: auditoperacao,
              auditobj: auditobj
            }
            console.log(obj);
            this.service.postCancelaEstorno(obj).subscribe(async c => {
              console.log(c);
              if (c.status == '200') {
                await this.showLoader(false);
                // console.log('funcionou');
                this.vendalist[index].stats = stats;
                this.vendalist[index].valoratual = valoratual;
                this.vendalist[index].valorestorno = valorestorno;
                await this.delay(25);
                alert("Estorno cancelado");
              }

              if (c.status != '200') {
                // console.log('nao funcionou erro cad venda');
                this.sloader = 0;
                alert("Erro ao cancelar estorno");
              }
            });
          }
          else if (result != '') {
            this.sloader = 0;
            alert("Senha incorreta");
          }
        },
          (error) => {
            this.sloader = 0;
            // //console.log('n funcionou por causa do user');
            alert("Erro ao cancelar estorno");
          });
      });
    }
    if (this.vendalist[index].waitestornostatus == 1) {
      alert("Esta venda possui uma solicitação de estorno pendente. Responda a solicitação para poder cancelar este estorno.")
    }
  }

  showLoader(display: boolean) {
    if (display == true) {
      this.sloader = 1;
    }
    if (display == false) {
      this.sloader = 0;
    }
  }

  estornaVenda(index: any) {
    console.log(this.user);
    console.log(this.vendalist[index]);
    let role = this.role;
    let userunidade = this.user.unidade;
    let vendaunidade = this.vendalist[index].unidade;
    let id = this.vendalist[index].id;
    let waitestorno = this.vendalist[index].waitestornostatus;
    let waitestornouser = this.vendalist[index].waitestornouser;
    let waitestornotxt = this.vendalist[index].waitestornotxt;
    let waitestornovalor = this.vendalist[index].waitestornovalor;
    console.log(waitestorno);
    console.log(role);
    console.log(userunidade);
    console.log(vendaunidade);


    let venda = {
      id: this.vendalist[index].id,
      cliente: this.vendalist[index].cliente,
      fiador: this.vendalist[index].fiador,
      cpfpaciente: this.vendalist[index].cpfpaciente,
      cpffiador: this.vendalist[index].cpffiador,
      docfinanceiro: this.vendalist[index].docfinanceiro,
      docodc: this.vendalist[index].docodc,
      parcela: this.vendalist[index].parcela,
      valortotal: this.vendalist[index].valortotal,
      valoratual: this.vendalist[index].valoratual,
      valorestorno: this.vendalist[index].valorestorno,
      isnotfiador: this.vendalist[index].isnotfiador,
      financiador: this.vendalist[index].financiador,
      createdby: this.vendalist[index].createdby,
      createdat: this.vendalist[index].createdat,
      updatedat: this.vendalist[index].updatedat,
      unidade: this.vendalist[index].unidade,
      stats: this.vendalist[index].stats,
      formapagparcela: this.vendalist[index].formapagparcela,
      tipoparcelamento: this.vendalist[index].tipoparcelamento,
      valortabela: this.vendalist[index].valortabela,
      valorparcela: this.vendalist[index].valorparcela,
      valoravaliacao: this.vendalist[index].valoravaliacao,
      valorfinanciado: this.vendalist[index].valorfinanciado,
      valorcomercial: this.vendalist[index].valorcomercial,
      valorentrada: this.vendalist[index].valorentrada,
      desconto: this.vendalist[index].desconto,
      waitestornostatus: this.vendalist[index].waitestornostatus,
      waitestornodate: this.vendalist[index].waitestornodate,
      waitestornovalor: this.vendalist[index].waitestornovalor,
      waitestornofpag: this.vendalist[index].waitestornofpag,
      waitestornotxt: this.vendalist[index].waitestornotxt,
      waitestornouser: this.vendalist[index].waitestornouser,
      entradas: this.vendalist[index].entradas,
      produtos: this.vendalist[index].produtos
    }
    if (role == 'admin') {
      let stats: any;
      let audittxt: any;
      let tipo: any;
      let auditobj = 'Venda';
      let auditoperacao: any;

      //let objvenda = this.vendalist[index];
      console.log(this.vendalist[index]);
      // //console.log(venda);
      let inf: any;
      let modaltxtb: any;
      let modaltxta = "Insira o valor a ser estornado";
      let valor;


      const dialogRefa = this.dialog.open(EstornamodalComponent, {
        data: {
          valor: valor,
          valoratual: venda.valoratual,
          valortotal: venda.valortotal,
          valorestorno: venda.valorestorno,
          modaltxt: modaltxta
        }
      });
      dialogRefa.afterClosed().subscribe(result => {
        console.log(result);
        if (result) {

          console.log(this.vendalist[index]);
          console.log(venda);
          console.log(result);
          let inputestorno = result.result;

          let valoratual = this.decimalFix(Number(venda.valoratual) - Number(inputestorno));
          let valorestorno = this.decimalFix(Number(venda.valorestorno) + Number(inputestorno));
          console.log(venda);
          if (valoratual < venda.valortotal && valoratual > 0) {
            tipo = 1;
          }
          if (valoratual == 0) {
            tipo = 2;
          }
          console.log(tipo);

          if (venda.isnotfiador == 0) {
            inf = "CPF: " + venda.cpffiador;
          }
          if (venda.isnotfiador == 1) {
            inf = "CPF: " + venda.cpfpaciente + " - CPF Fiador: " + venda.cpffiador;
          }

          if (tipo == 1) {
            stats = 'estorno parcial';
            auditoperacao = 'Estorno Parcial';
            modaltxtb = 'Insira sua senha para confirmar o estorno de ' + formatCurrency(Number(inputestorno), 'pt-BR', 'R$');
            audittxt = "Estorno parcial de venda. Cliente: " + venda.cliente + " " + inf + ". Valor total da venda: " + formatCurrency(Number(venda.valortotal), 'pt-BR', 'R$') + " - Valor atual " + formatCurrency(Number(valoratual), 'pt-BR', 'R$') + " - Valor estornado " + formatCurrency(Number(inputestorno), 'pt-BR', 'R$') + " - financiador: " + venda.financiador + " - data da venda: " + formatDate(venda.createdat, 'dd/MM/yyyy', 'pt-BR') + " - Doc Financeiro: " + venda.docfinanceiro + " - Doc ODC: " + venda.docodc + "";
          }
          if (tipo == 2) {
            stats = 'estorno';
            auditoperacao = 'Estorno';
            modaltxtb = 'Insira sua senha para confirmar o estorno de ' + formatCurrency(Number(inputestorno), 'pt-BR', 'R$');
            audittxt = "Estorno total de venda. Cliente: " + venda.cliente + " " + inf + ". Valor total da venda: " + formatCurrency(Number(venda.valortotal), 'pt-BR', 'R$') + " - Valor atual " + formatCurrency(Number(valoratual), 'pt-BR', 'R$') + " - Valor estornado " + formatCurrency(Number(inputestorno), 'pt-BR', 'R$') + " - financiador: " + venda.financiador + " - data da venda: " + formatDate(venda.createdat, 'dd/MM/yyyy', 'pt-BR') + " - Doc Financeiro: " + venda.docfinanceiro + " - Doc ODC: " + venda.docodc + "";
          }
          if (tipo == 3) {
            stats = 'ativo';
            auditoperacao = 'Cancel. estorno';
            modaltxtb = 'Insira sua senha para cancelar o estorno e reativar esta venda';
            audittxt = "Cancelamento de estorno. Cliente: " + venda.cliente + " " + inf + ". Valor total da venda: " + formatCurrency(Number(venda.valortotal), 'pt-BR', 'R$') + " - Valor atual " + formatCurrency(Number(valoratual), 'pt-BR', 'R$') + " - Valor estornado " + formatCurrency(Number(inputestorno), 'pt-BR', 'R$') + " - financiador: " + venda.financiador + " - data da venda: " + formatDate(venda.createdat, 'dd/MM/yyyy', 'pt-BR') + " - Doc Financeiro: " + venda.docfinanceiro + " - Doc ODC: " + venda.docodc + "";
          }


          const dialogRef = this.dialog.open(ModalbComponent, {
            data: {
              pass: this.pwd,
              modaltxt: modaltxtb
            }
          });

          dialogRef.afterClosed().subscribe(result => {

            const username = this.auth.getUser();
            //this.sloader = 1;
            if (result) {
              this.sloader = 1;
            }
            const obj = {
              id: id,
              stats: stats,
              valoratual: valoratual,
              valorestorno: valorestorno,
              audittxt: audittxt,
              user: this.user.username,
              unidade: this.user.unidade,
              auditoperacao: auditoperacao,
              auditobj: auditobj
            }
            console.log(obj);
            this.service.getUser(username).subscribe(u => {
              let user = u;
              console.log(username);
              // console.log(user);

              if (result == user.pwd) {
                //          this.sloader = 1;
                this.service.postEstornaVenda(obj).subscribe(async c => {
                  console.log(c);
                  if (c.status == '200') {
                    if (tipo == 1 || tipo == 2) {
                      // console.log('funcionou');
                      await this.showLoader(false);
                      this.vendalist[index].stats = stats;
                      this.vendalist[index].valoratual = valoratual;
                      this.vendalist[index].valorestorno = valorestorno;
                      await this.delay(25);
                      alert("Venda estornada");
                    }
                    if (tipo == 3) {
                      alert("Estorno de venda cancelado");
                    }
                  }
                  if (c.status != '200') {
                    // console.log('nao funcionou erro cad venda');
                    this.sloader = 0;
                    alert("Erro ao estornar venda");
                  }
                });
              }
              else if (result != '') {
                this.sloader = 0;
                alert("Senha incorreta");
              }
            },
              (error) => {
                this.sloader = 0;
                // //console.log('n funcionou por causa do user');
                alert("Erro ao estornar venda");
              });
          });
        }
      });
    }
    if (role == 'gerente' && userunidade == vendaunidade) {
      const dialogRefa = this.dialog.open(ModalsolicitaestornoComponent, {
        data: {
          venda: venda,
          id: id,
          waitestorno: waitestorno,
          waitestornouser: waitestornouser,
          waitestornotxt: waitestornotxt,
          waitestornovalor: waitestornovalor,
          user: this.user.username
        },
        panelClass: 'modalestorno'
      });
      dialogRefa.afterClosed().subscribe(result => {
        console.log(result);
        if (result) {
          let alertmsgok: string;
          let alertmsgerror: string;
          if (result.waitestorno == 1) {
            alertmsgok = "Solicitação de estorno enviada";
            alertmsgerror = "Erro ao solicitar estorno";
          }
          if (result.waitestorno == 0) {
            alertmsgok = "Solicitação de estorno cancelada";
            alertmsgerror = "Erro ao cancelar solicitação de estorno";
          }
          this.sloader = 1;
          this.service.waitForEstorno(result).subscribe(v => {
            console.log(v);
            if (v.stats == 'ok') {
              alert(alertmsgok);
              this.sloader = 0;
              this.vendalist[index].waitestornostatus = result.waitestorno;
              this.vendalist[index].waitestornovalor = result.waitestornovalor;
              this.vendalist[index].waitestornouser = result.waitestornouser;
              this.vendalist[index].waitestornotxt = result.waitestornotxt;
              this.vendalist[index].waitestornofpag = result.waitestornofpag;
              this.vendalist[index].waitestornodate = new Date();
              let tempobj = result;
              tempobj.venda.waitestornodate = new Date();
              let printobj = tempobj;
              if (printobj.waitestorno == 1) {
                const dialogRefa = this.dialog.open(ModalprintrequerimentoComponent, {
                  data: {
                    obj: printobj,
                    tipo: 'normal'
                  },
                  panelClass: 'modalprintreq'
                });
                dialogRefa.afterClosed().subscribe(result2 => {
                  console.log(result2);
                });
              }
            }
            if (v.stats == 'error') {
              alert(alertmsgerror);
              this.sloader = 0;
            }
          },
            (error) => {
              console.log(error);
              alert(alertmsgerror);
              this.sloader = 0;
            });
        }
      });
    }
  }
  // estornaVendaJF(index: any) {
  //   let id = this.vendalist[index].id;
  //   let stats: any;
  //   let audittxt: any;
  //   let tipo: any;
  //   let auditobj = 'Venda';
  //   let auditoperacao: any;
  //   let venda = {
  //     cliente: this.vendalist[index].cliente,
  //     cpffiador: this.vendalist[index].cpffiador,
  //     cpfpaciente: this.vendalist[index].cpfpaciente,
  //     createdat: this.vendalist[index].createdat,
  //     createdby: this.vendalist[index].createdby,
  //     docfinanceiro: this.vendalist[index].docfinanceiro,
  //     docodc: this.vendalist[index].docodc,
  //     financiador: this.vendalist[index].financiador,
  //     id: this.vendalist[index].id,
  //     isnotfiador: this.vendalist[index].isnotfiador,
  //     stats: this.vendalist[index].stats,
  //     unidade: this.vendalist[index].unidade,
  //     updatedat: this.vendalist[index].updatedat,
  //     valoratual: this.vendalist[index].valoratual,
  //     valorestorno: this.vendalist[index].valorestorno,
  //     valortotal: this.vendalist[index].valortotal
  //   }
  //   //let objvenda = this.vendalist[index];
  // //   console.log(this.vendalist[index]);
  // //   //console.log(venda);
  //   let inf: any;
  //   let modaltxtb: any;
  //   let modaltxta = "Insira o valor a ser estornado";
  //   let valor;


  //   const dialogRefa = this.dialog.open(EstornamodalComponent, {
  //     data: {
  //       valor: valor,
  //       valoratual: venda.valoratual,
  //       valortotal: venda.valortotal,
  //       valorestorno: venda.valorestorno,
  //       modaltxt: modaltxta
  //     }
  //   });
  //   dialogRefa.afterClosed().subscribe(result => {
  // //     console.log(result);
  //     if (result) {

  // //       console.log(this.vendalist[index]);
  // //       console.log(venda);
  // //       console.log(result);
  //       let inputestorno = result.result;

  //       let valoratual = this.decimalFix(Number(venda.valoratual) - Number(inputestorno));
  //       let valorestorno = this.decimalFix(Number(venda.valorestorno) + Number(inputestorno));
  // //       console.log(venda);
  //       if (valoratual < venda.valortotal && valoratual > 0) {
  //         tipo = 1;
  //       }
  //       if (valoratual == 0) {
  //         tipo = 2;
  //       }
  // //       console.log(tipo);

  //       if (venda.isnotfiador == 0) {
  //         inf = "CPF: " + venda.cpffiador;
  //       }
  //       if (venda.isnotfiador == 1) {
  //         inf = "CPF: " + venda.cpfpaciente + " - CPF Fiador: " + venda.cpffiador;
  //       }

  //       if (tipo == 1) {
  //         stats = 'estorno parcial';
  //         auditoperacao = 'Estorno Parcial';
  //         modaltxtb = 'Insira sua senha para confirmar o estorno de ' + formatCurrency(Number(inputestorno), 'pt-BR', 'R$');
  //         audittxt = "Estorno parcial de venda. Cliente: " + venda.cliente + " " + inf + ". Valor total da venda: " + formatCurrency(Number(venda.valortotal), 'pt-BR', 'R$') + " - Valor atual " + formatCurrency(Number(valoratual), 'pt-BR', 'R$') + " - Valor estornado " + formatCurrency(Number(inputestorno), 'pt-BR', 'R$') + " - financiador: " + venda.financiador + " - data da venda: " + formatDate(venda.createdat, 'dd/MM/yyyy', 'pt-BR') + " - Doc Financeiro: " + venda.docfinanceiro + " - Doc ODC: " + venda.docodc + "";
  //       }
  //       if (tipo == 2) {
  //         stats = 'estorno';
  //         auditoperacao = 'Estorno';
  //         modaltxtb = 'Insira sua senha para confirmar o estorno de ' + formatCurrency(Number(inputestorno), 'pt-BR', 'R$');
  //         audittxt = "Estorno total de venda. Cliente: " + venda.cliente + " " + inf + ". Valor total da venda: " + formatCurrency(Number(venda.valortotal), 'pt-BR', 'R$') + " - Valor atual " + formatCurrency(Number(valoratual), 'pt-BR', 'R$') + " - Valor estornado " + formatCurrency(Number(inputestorno), 'pt-BR', 'R$') + " - financiador: " + venda.financiador + " - data da venda: " + formatDate(venda.createdat, 'dd/MM/yyyy', 'pt-BR') + " - Doc Financeiro: " + venda.docfinanceiro + " - Doc ODC: " + venda.docodc + "";
  //       }
  //       if (tipo == 3) {
  //         stats = 'ativo';
  //         auditoperacao = 'Cancel. estorno';
  //         modaltxtb = 'Insira sua senha para cancelar o estorno e reativar esta venda';
  //         audittxt = "Cancelamento de estorno. Cliente: " + venda.cliente + " " + inf + ". Valor total da venda: " + formatCurrency(Number(venda.valortotal), 'pt-BR', 'R$') + " - Valor atual " + formatCurrency(Number(valoratual), 'pt-BR', 'R$') + " - Valor estornado " + formatCurrency(Number(inputestorno), 'pt-BR', 'R$') + " - financiador: " + venda.financiador + " - data da venda: " + formatDate(venda.createdat, 'dd/MM/yyyy', 'pt-BR') + " - Doc Financeiro: " + venda.docfinanceiro + " - Doc ODC: " + venda.docodc + "";
  //       }


  //       const dialogRef = this.dialog.open(ModalbComponent, {
  //         data: {
  //           pass: this.pwd,
  //           modaltxt: modaltxtb
  //         }
  //       });

  //       dialogRef.afterClosed().subscribe(result => {

  //         const username = this.auth.getUser();
  //         //this.sloader = 1;
  //         if (result) {
  //           this.sloader = 1;
  //         }
  //         const obj = {
  //           id: id,
  //           stats: stats,
  //           valoratual: valoratual,
  //           valorestorno: valorestorno,
  //           audittxt: audittxt,
  //           user: this.user.username,
  //           unidade: this.user.unidade,
  //           auditoperacao: auditoperacao,
  //           auditobj: auditobj
  //         }
  // //         console.log(obj);
  //         this.service.getUser(username).subscribe(u => {
  //           let user = u;
  // //           console.log(username);
  // //           console.log(user);

  //           if (result == user.pwd) {
  //             //          this.sloader = 1;
  //             this.service.postEstornaVenda(obj).subscribe(async c => {
  // //               console.log(c);
  //               if (c.status == '200') {
  //                 if (tipo == 1 || tipo == 2) {
  // //                   console.log('funcionou');
  //                   await this.showLoader(false);
  //                   this.vendalist[index].stats = stats;
  //                   this.vendalist[index].valoratual = valoratual;
  //                   this.vendalist[index].valorestorno = valorestorno;
  //                   await this.delay(25);
  //                   alert("Venda estornada");
  //                 }
  //                 if (tipo == 3) {
  //                   alert("Estorno de venda cancelado");
  //                 }
  //               }
  //               if (c.status != '200') {
  // //                 console.log('nao funcionou erro cad venda');
  //                 this.sloader = 0;
  //                 alert("Erro ao estornar venda");
  //               }
  //             });
  //           }
  //           else if (result != '') {
  //             this.sloader = 0;
  //             alert("Senha incorreta");
  //           }
  //         },
  //           (error) => {
  //             this.sloader = 0;
  // //             //console.log('n funcionou por causa do user');
  //             alert("Erro ao estornar venda");
  //           });
  //       });
  //     }
  //   });
  // }

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // estornaVenda(tipo: any, index: any) {
  //   let id = this.vendalist[index].id;
  //   let stats: any;
  //   let audittxt;
  //   let auditobj = 'Venda';
  //   let auditoperacao;
  //   let venda = this.vendalist[index];
  // //   console.log(venda);
  //   let inf;
  //   let modaltxt;
  //   if (venda.isnotfiador == 0) {
  //     inf = "CPF: " + venda.cpffiador;
  //   }
  //   if (venda.isnotfiador == 1) {
  //     inf = "CPF: " + venda.cpfpaciente + " - CPF Fiador: " + venda.cpffiador;
  //   }

  //   if (tipo == 1) {
  //     stats = 'estorno parcial';
  //     auditoperacao = 'Estorno Parcial';
  //     modaltxt = 'Insira sua senha para confirmar o estorno parcial desta venda';
  //     audittxt = "Estorno parcial de venda. Cliente: " + venda.cliente + " " + inf + ". Valor da venda: " + formatCurrency(Number(venda.valortotal), 'pt-BR', 'R$') + " - financiador: " + venda.financiador + " - data da venda: " + formatDate(venda.createdat, 'dd/MM/yyyy', 'pt-BR') + " - Doc Financeiro: " + venda.docfinanceiro + " - Doc ODC: " + venda.docodc + "";
  //   }
  //   if (tipo == 2) {
  //     stats = 'estorno';
  //     auditoperacao = 'Estorno';
  //     modaltxt = 'Insira sua senha para confirmar o estorno total desta venda';
  //     audittxt = "Estorno total de venda. Cliente: " + venda.cliente + " " + inf + ". Valor da venda: " + formatCurrency(Number(venda.valortotal), 'pt-BR', 'R$') + " - financiador: " + venda.financiador + " - data da venda: " + formatDate(venda.createdat, 'dd/MM/yyyy', 'pt-BR') + " - Doc Financeiro: " + venda.docfinanceiro + " - Doc ODC: " + venda.docodc + "";
  //   }
  //   if (tipo == 3) {
  //     stats = 'ativo';
  //     auditoperacao = 'Cancel. estorno';
  //     modaltxt = 'Insira sua senha para cancelar o estorno e reativar esta venda';
  //     audittxt = "Cancelamento de estorno. Cliente: " + venda.cliente + " " + inf + ". Valor da venda: " + formatCurrency(Number(venda.valortotal), 'pt-BR', 'R$') + " - financiador: " + venda.financiador + " - data da venda: " + formatDate(venda.createdat, 'dd/MM/yyyy', 'pt-BR') + " - Doc Financeiro: " + venda.docfinanceiro + " - Doc ODC: " + venda.docodc + "";
  //   }
  //   const obj = {
  //     id: id,
  //     stats: stats,
  //     audittxt: audittxt,
  //     user: this.user.username,
  //     unidade: this.user.unidade,
  //     auditoperacao: auditoperacao,
  //     auditobj: auditobj
  //   }
  // //   console.log(obj);
  //   const dialogRef = this.dialog.open(ModalbComponent, {
  //     data: {
  //       pass: this.pwd,
  //       modaltxt: modaltxt
  //     }
  //   });
  //   dialogRef.afterClosed().subscribe(result => {

  //     const username = this.auth.getUser();
  //     //this.sloader = 1;
  //     if (result) {
  //       this.sloader = 1;
  //     }
  //     this.service.getUser(username).subscribe(u => {
  //       let user = u;
  // //       console.log(username);
  // //       console.log(user);

  //       if (result == user.pwd) {
  //         //          this.sloader = 1;
  //         this.service.postEstornaVenda(obj).subscribe(c => {
  //           this.sloader = 0;
  // //           console.log(c);
  //           if (tipo == 1 || tipo == 2) {
  //             alert("Venda estornada");
  //           }
  //           if (tipo == 3) {
  //             alert("Estorno de venda cancelado");
  //           }
  //           this.vendalist[index].stats = stats;
  //         },
  //           (error) => {
  //             this.sloader = 0;
  //             alert("Erro ao estornar venda");
  //           });
  //       }
  //       else if (result != '') {
  //         this.sloader = 0;
  //         alert("Senha incorreta");
  //       }
  //     },
  //       (error) => {
  //         this.sloader = 0;
  //         alert("Erro ao estornar venda");
  //       });
  //   });

  // }

  getSessionItem() {
    let token: any = sessionStorage.getItem('token');
    let checktoken = JSON.parse(JSON.stringify(jwt_decode(token)));
    this.role = checktoken.tipo;
    this.user = {
      nome: checktoken.nome,
      username: checktoken.username,
      unidade: checktoken.unidade
    }
    console.log(this.role);
    console.log(this.user);
    console.log(this.user.nome);
    console.log(token);

  }
  showDeps() {
    console.log(this.dependentesx);
  }

  btnBusca() {

  }

  decimalFix(val: any) {
    let value = Number((Math.round(val * 100) / 100).toFixed(2));
    return value;
  }

  trocarValor(valor: number) {
    this.enabletitb = valor;

  }

  incTitular() {
    this.enabletitb = 0;
    // this.profileForm.enable();
    this.enabletitinc = 1;


  }
  enableBuscaCli() {

    this.profileForm.disable();
    this.profileForm.reset();
    this.profileForm.controls["buscacliente"].enable();
    this.profileForm.controls["buscacliente"].setValue('');
    this.objcliente = [];
    this.objbuscac = [];
    this.dependentes = [];
  }

  enableBuscaVen() {

    this.vendedorForm.disable();
    this.vendedorForm.reset();
    this.vendedorForm.controls["buscavendedor"].enable();
    this.vendedorForm.controls["buscavendedor"].setValue('');
    this.objvendedor = [];
    this.objbuscav = [];
  }


  enabletitbVariavel() {
    console.log(this.profileForm.value)
    alert(this.profileForm.value.vendedor);

  }


  enableForm() {
    alert("Estou funcionando!")
  }

  printContratoTest() {
    // const contr = new jsPDF();
    // var string = contr.output('datauristring');
    // var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
    // var x = window.open();
    // x.document.open();
    // x.document.write(embed);
    // x.document.close();
  }

  download() {
    let fileName = 'download.csv';
    let columnNames = ["id", "cliente", "cpf_fiador", "cpf_paciente", "fiador", "valor_total", "data_venda", "doc_financeiro", "doc_odc", "financiador", "usuario", "unidade"];
    let header = columnNames.join(';');

    let csv = header;
    csv += '\r\n';

    this.vendalist.map((c: { [x: string]: any; }) => {
      csv += [c["id"], c["cliente"], c["cpffiador"], c["cpfpaciente"], c["isnotfiador"], c["valortotal"], c["createdat"], c["docfinanceiro"], c["docodc"], c["financiador"], c["createdby"], c["unidade"]].join(';');
      csv += '\r\n';
    })

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8,%EF%BB%BF;" });

    var link = document.createElement("a");
    if (link.download !== undefined) {
      var url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }

  searchParams() {
    let vala;
    let valb;
    let dta = this.buscaForm.controls["dtinicio"].value;
    let dtb = this.buscaForm.controls["dtfim"].value;
    let cpf;
    let unidade;
    let financiador;

    if (this.buscaForm.controls["valinicio"].value != '' && this.buscaForm.controls["valinicio"].value != 0 && this.buscaForm.controls["valinicio"].value != null) {
      vala = this.buscaForm.controls["valinicio"].value;
    }
    else {
      vala = null;
    }
    if (this.buscaForm.controls["valfim"].value != '' && this.buscaForm.controls["valfim"].value != 0 && this.buscaForm.controls["valfim"].value != null) {
      valb = this.buscaForm.controls["valfim"].value;
    }
    else {
      valb = null;
    }
    if (this.buscaForm.controls["cpf"].value != '' && this.buscaForm.controls["cpf"].value != null) {
      cpf = this.buscaForm.controls["cpf"].value;
    }
    else {
      cpf = null;
    }
    if (this.buscaForm.controls["unidade"].value != '' && this.buscaForm.controls["unidade"].value != null && this.buscaForm.controls["unidade"].value != "todas") {
      unidade = this.buscaForm.controls["unidade"].value;
    }
    else {
      unidade = null;
    }
    if (this.buscaForm.controls["financiador"].value != '' && this.buscaForm.controls["financiador"].value != null && this.buscaForm.controls["financiador"].value != "todos") {
      financiador = this.buscaForm.controls["financiador"].value;
    }
    else {
      financiador = null;
    }

    let params = {
      dta: dta,
      dtb: dtb,
      vala: vala,
      valb: valb,
      cpf: cpf,
      unidade: unidade,
      financiador: financiador
    }
    return params;
  }

  getVendas() {
    this.sloader = 1;
    const obj = this.searchParams();
    console.log(obj);
    this.valtotvendas = 0;
    this.countvendas = 0;
    let json = JSON.stringify(obj);
    this.service.getVendaList(json).subscribe(v => {
      this.sloader = 0;
      console.log(v);
      this.vendalist = v.Vendas;
      let valtotal = 0;
      let countvendas = 0;
      for (let i = 0; i < this.vendalist.length; i++) {
        countvendas++;
        valtotal = this.vendalist.valortotal + valtotal;
        valtotal = this.decimalFix(valtotal);
      }
      this.valtotvendas = valtotal;
      this.countvendas = countvendas;
      console.log(this.vendalist);
      this.showcomp = 0;
    },
      (error) => {
        console.log(error);
        this.sloader = 0;
        alert("Erro ao buscar vendas");
      });
  }

  buscaClienteNome() {

    if (this.profileForm.controls["buscacliente"].value.length >= 3) {
      this.service.getClienteNome(this.profileForm.controls["buscacliente"].value).subscribe(c => {
        console.log(c.Cliente);
        this.objbuscac = c.Clientes;
        console.log(c);
      });
    }
    if (this.profileForm.controls["buscacliente"].value.length < 3) {
      this.objbuscac = [];
    }
  }


  fillFormCliente(cli: any, index: any) {
    this.objcliente = this.objbuscac[index];
    this.dependentes = [];
    this.service.getDependenteList(this.objcliente.id).subscribe(c => {
      console.log(this.objcliente.id);
      console.log(c);
      if (!c.dependentes) {
        this.dependentes = []
        console.log(this.dependentes);
      }
      else {
        this.dependentes = c.dependentes;
        console.log(this.dependentes);
      }
    });
    console.log(cli);
    this.profileForm.controls["buscacliente"].setValue('');
    this.profileForm.controls["buscacliente"].disable();
    this.profileForm.controls["titularnome"].setValue(cli.nome);
    this.profileForm.controls["titularcpf"].setValue(cli.cpf);
    this.profileForm.controls["titularrg"].setValue(cli.rg);
    this.profileForm.controls["titularorgao"].setValue(cli.orgao);
    this.profileForm.controls["titularnasc"].setValue(cli.dtnasc);
    this.profileForm.controls["titulargen"].setValue(cli.genero);
    this.profileForm.controls["titularemail"].setValue(cli.email);
    this.profileForm.controls["titularcel"].setValue(cli.celular);
    this.profileForm.controls["titulartel"].setValue(cli.telefone);
    this.profileForm.controls["titularendereco"].setValue(cli.endereco);
    this.profileForm.controls["titularcep"].setValue(cli.cep);
    this.profileForm.controls["titularnum"].setValue(cli.numero);
    this.profileForm.controls["titularcomp"].setValue(cli.complemento);
    this.profileForm.controls["titularbairro"].setValue(cli.bairro);
    this.profileForm.controls["titularcidade"].setValue(cli.cidade);
    this.profileForm.controls["titularestado"].setValue(cli.estado);
    if (cli.whatsapp == "1") {
      this.profileForm.controls["titularwhatsapp"].setValue(true);
    }
    else {
      this.profileForm.controls["titularwhatsapp"].setValue(false);
    }



  }

  buscaVendedorNome() {
    if (this.vendedorForm.controls["buscavendedor"].value.length >= 3) {
      this.service.getVendedorNome(this.vendedorForm.controls["buscavendedor"].value).subscribe(c => {
        console.log(c.Vendedores);
        this.objbuscav = c.Vendedores;
      }
      );
    }
    if (this.vendedorForm.controls["buscavendedor"].value.length < 3) {
      this.objbuscav = [];
    }
  }
  fillFormVendedor(ven: any, index: any) {
    // console.log(ven);
    this.objvendedor = this.objbuscav[index];
    console.log(this.objvendedor);

    this.vendedorForm.controls["buscavendedor"].disable();
    this.vendedorForm.controls["buscavendedor"].setValue('');
    this.vendedorForm.controls["vendedornome"].setValue(ven.nome);
    this.vendedorForm.controls["vendedorcpf"].setValue(ven.cpf);
    this.vendedorForm.controls["vendedorrg"].setValue(ven.rg);
    // this.vendedorForm.controls["vendedororgao"].setValue(ven.orgao);
    this.vendedorForm.controls["vendedornasc"].setValue(ven.dtnasc);
    // this.vendedorForm.controls["vendedorgen"].setValue(ven.genero);
    this.vendedorForm.controls["vendedoradmissao"].setValue(ven.dtadmissao);

  }

  fillVendedor(ven: any, index: any) {
    this.profileForm.controls["vendedor"].setValue(ven.nome);
    console.log(ven);
    this.objvendedor = this.objbuscav[index];
    this.objbuscav = [];
  }

  detailsVendaJF(index: any) {
    let venda = this.vendalist[index];
    const dialogRefa = this.dialog.open(ModaldetailsjfComponent, {
      data: {
        venda: venda
      },
      panelClass: 'modaldetails'
    });
    dialogRefa.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
  printComprovante(): void {
    let printContents, popupWin;
    printContents = document.getElementById('printcomprovante')!.innerHTML;
    popupWin = window.open('', '_blank');
    popupWin!.document.open();
    popupWin!.document.write(`
      <html>
        <head>
          <title>Comprovante</title>
          <style>
            .no-print {
              visibility: hidden;
            }
            .comprovante {
              font-size: 49px;
              line-height: 1;
              page-break-inside: avoid;
            }
          </style>
          <link rel="stylesheet" href="styles.css">
        </head>
    <body onload="window.print();window.close();">${printContents}
    </body>
      </html>`
    );
    popupWin!.document.close();
  }
  jfContrato(index: any) {
    let venda = this.vendalist[index];
    const dialogRefa = this.dialog.open(ModalcontratojfComponent, {
      data: {
        venda: venda
      },
      panelClass: 'modalprintreq'
    });
    dialogRefa.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}


// id
// cliente
// cpfpaciente
// cpffiador
// docfinanceiro
// docodc
// parcela
// valortotal
// valoratual
// valorestorno
// isnotfiador
// financiador
// createdby
// createdat
// updatedat
// unidade
// stats
// formapagparcela
// tipoparcelamento
// valortabela
// valorparcela
// valoravaliacao
// valorfinanciado
// valorcomercial
// valorentrada
// desconto
// waitestornostatus
// waitestornovalor
// waitestornofpag
// waitestornotxt
// waitestornouser
// entradas
// produtos