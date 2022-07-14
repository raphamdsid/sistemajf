import { Component, OnInit, ElementRef, ViewChildren, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ControlContainer, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import jspdf, { jsPDF, jsPDFOptions } from 'jspdf';
import { ConsultaService } from '../services/consulta.service';
import { formatDate, TitleCasePipe, DatePipe, formatCurrency } from '@angular/common';
import * as html2canvas from 'html2canvas';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { HttpClient } from '@angular/common/http';
import { validate } from 'gerador-validador-cpf';
import { AuthService } from '../auth/auth.service';
import jwt_decode from "jwt-decode";
import { Router } from '@angular/router';
import { ModalaComponent } from '../financeiro/modala/modala.component';
import { AdminmodalComponent } from './adminmodal/adminmodal.component';
import { ModalunidadeComponent } from './modalunidade/modalunidade.component';
import { ToolsService } from '../services/tools.service';
import { ModaledittaxaComponent } from './modaledittaxa/modaledittaxa.component';
import { ModalnewprodutoComponent } from './modalnewproduto/modalnewproduto.component';
import { ModaleditprodutoComponent } from './modaleditproduto/modaleditproduto.component';
import { ModaldelprodutoComponent } from './modaldelproduto/modaldelproduto.component';
import { ModalfornecedoresComponent } from './modalfornecedores/modalfornecedores.component';
import { ModalfinanciadorComponent } from './modalfinanciador/modalfinanciador.component';
import { ModalentradaconfComponent } from './modalentrada/modalentrada.component';
import { ModalconfirmwaitdescontoComponent } from './modalconfirmwaitdesconto/modalconfirmwaitdesconto.component';
import { ModalbancoComponent } from './modalbanco/modalbanco.component';
import { ModalconfirmwaitestornoexComponent } from './modalconfirmwaitestornoex/modalconfirmwaitestornoex.component';
import { ModalprintrequerimentoComponent } from '../consulta/modalprintrequerimento/modalprintrequerimento.component';
import { ModaldetailsexestornoComponent } from './modaldetailsexestorno/modaldetailsexestorno.component';
import { ModalconfirmwaitestornoespecialComponent } from './modalconfirmwaitestornoespecial/modalconfirmwaitestornoespecial.component';
import { EstornamodalComponent } from '../consulta/estornamodal/estornamodal.component';
import { ModalbComponent } from '../financeiro/modalb/modalb.component';
import { ModalsolicitaestornoComponent } from '../consulta/modalsolicitaestorno/modalsolicitaestorno.component';
import { ModallaboratorioComponent } from './modallaboratorio/modallaboratorio.component';
import { ModalprodosComponent } from './modalprodos/modalprodos.component';
//import { ModalconfigComponent } from './modalconfig/modalconfig.component';


@Component({
    selector: 'app-adminpanel',
    templateUrl: './adminpanel.component.html',
    styleUrls: ['./adminpanel.component.scss']
})
export class AdminpanelComponent implements OnInit {
    role: any;
    user: any;
    userdata: any;
    configfinForm: any;
    configfinCatForm: any;
    configfinTaxaForm: any;
    resetpwdForm: any;
    newuserForm: any;
    newusergForm: any;
    auditForm: any;
    produtosForm: any;
    searchuserForm: any;
    tabindex: number = 0;
    objuser: any;
    operacao: any;
    buscausuario: any;
    auditlogs: any;
    sloader: any = 0;
    @ViewChild('newusercpf', { static: false }) usercpf: any;
    @ViewChild('estornocpf', { static: false }) estcpf: any;
    @ViewChild('buscacpfgerente', { static: false }) bcpfger: any;
    @ViewChild('buscacpfadmin', { static: false }) bcpfadmin: any;
    @ViewChild('chavepix', { static: false }) cpix: any;
    taxas: any;
    prodlist: any = [];
    prodtxt: string = '';
    showprodlist: number = 0;
    objunidade: any;
    financiadores: any = [];
    entradas: any = [];
    buscaEstornoForm: any;
    buscaEstornoGerenteForm: any;
    today: any;
    waitestornolist: any = [];
    waitestornolistger: any = [];
    exEstornoForm: any;
    bancoarray: any = [];
    showmotivo: number = 0;
    buscaExEstornoForm: any;
    bancos: any = [];
    bcod: any = '';
    exestornolist: any = [];
    buscaRelatorioEstornosForm: any;
    thisday: any;
    countestornos: Number = 0;
    totalestornos: Number = 0;
    estornolist: any = [];
    dta: any;
    dtb: any;
    pwd: any;
    laboratorios: any = [];
    produtosordemservico: any = [];
    unidades: any = [];
    usertypes: any = [];
    showunidade: number = 1;
    constructor(public dialog: MatDialog, private auth: AuthService, private service: ConsultaService, public tools: ToolsService,
        private formBuilder: FormBuilder, private http: HttpClient, private router: Router) { }

    ngOnInit(): void {

        // this.bancoarray = this.tools.sortObjArray(bancoarr, 'banco');
        let thisday = new Date();
        this.thisday = thisday;
        this.auth.isAuth();
        let curruser = this.getSessionItem();
        let role = this.auth.getRole();
        let today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
        this.today = today;
        console.log(role);
        this.tools.unidList().subscribe(data => {
            console.log(data);
            for (let x = 0; x < data.length; x++) {
                if (data[x].ativo == 1) {
                    this.unidades.push(data[x]);
                }
            }
            console.log(this.unidades);
        });
        this.tools.usertypeList().subscribe(data => {
            console.log(data);
            if (role == 'admin') {

                for (let x = 0; x < data.length; x++) {
                    if (data[x].ativo == 1) {
                        this.usertypes.push(data[x]);
                    }
                }
            }
            if (role != 'admin') {
                for (let x = 0; x < data.length; x++) {
                    if (data[x].ativo == 1 && data[x].has_unidade == 1 && data[x].admin_exclusive == 0) {
                        this.usertypes.push(data[x]);
                    }
                }
            }
            console.log(this.usertypes);
        });
        if (role != 'admin' && role != 'gerente') {
            this.router.navigate(['/home']);
        }
        this.service.getFinanciadores().subscribe(f => {
            console.log(f)
            this.financiadores = f;
        });
        this.service.getEntradas().subscribe(f => {
            console.log(f)
            this.entradas = f;
        });
        this.service.getBancos().subscribe(f => {
            console.log(f)
            this.bancos = f;
        });
        this.service.getLaboratorios().subscribe(f => {
            console.log(f)
            this.laboratorios = f;
        });
        this.service.getProdOs().subscribe(f => {
            console.log(f)
            this.produtosordemservico = f;
        });
        this.configfinForm = new FormGroup({
            cata: new FormControl('', Validators.required),
            catb: new FormControl('', Validators.required),
            catc: new FormControl('', Validators.required),
            catd: new FormControl('', Validators.required),
            cate: new FormControl('', Validators.required),
            catf: new FormControl('', Validators.required)
        });
        this.configfinCatForm = new FormGroup({
            boleto: new FormControl('', Validators.required),
            cheque: new FormControl('', Validators.required)
        });
        this.configfinTaxaForm = new FormGroup({
            taxa: new FormControl('', Validators.required)
        });
        this.resetpwdForm = new FormGroup({
            oldpwd: new FormControl('', Validators.required),
            oldpwdconfirm: new FormControl('', Validators.required),
            newpwd: new FormControl('', Validators.required)
        });
        this.newuserForm = new FormGroup({
            username: new FormControl('', Validators.required),
            nome: new FormControl('', Validators.required),
            cpf: new FormControl(null, Validators.required),
            tipo: new FormControl('comercial', Validators.required),
            unidade: new FormControl('ODC Nova Iguaçu I (Centro)', Validators.required)
        });
        this.newusergForm = new FormGroup({
            username: new FormControl('', Validators.required),
            nome: new FormControl('', Validators.required),
            cpf: new FormControl(null, Validators.required),
            // tipo: new FormControl('', Validators.required),
        });
        this.searchuserForm = new FormGroup({
            userbusca: new FormControl(''),
            usercriteria: new FormControl('1', Validators.required)
        });
        this.auditForm = new FormGroup({
            dtinicio: new FormControl('', Validators.required),
            dtfim: new FormControl('', Validators.required),
            busca: new FormControl('')
        });
        this.produtosForm = new FormGroup({
            unidade: new FormControl('ODC Nova Iguaçu I (Centro)', Validators.required)
        });

        this.buscaEstornoForm = new FormGroup({
            dtinicio: new FormControl(today, Validators.required),
            dtfim: new FormControl(today, Validators.required),
            valinicio: new FormControl(''),
            valfim: new FormControl(''),
            cpf: new FormControl(''),
            unidade: new FormControl('todas')
        });
        this.buscaEstornoGerenteForm = new FormGroup({
            dtinicio: new FormControl(today, Validators.required),
            dtfim: new FormControl(today, Validators.required),
            valinicio: new FormControl(''),
            valfim: new FormControl(''),
            cpf: new FormControl('')
        });
        this.buscaExEstornoForm = new FormGroup({
            dtinicio: new FormControl(today, Validators.required),
            dtfim: new FormControl(today, Validators.required)
        });
        this.exEstornoForm = new FormGroup({
            nome: new FormControl('', Validators.required),
            cpfcnpj: new FormControl('', Validators.required),
            docodc: new FormControl('', Validators.required),
            motivo: new FormControl('', Validators.required),
            fpagcompra: new FormControl('', Validators.required),
            valorcompra: new FormControl(0, Validators.required),
            valorestorno: new FormControl(0, Validators.required),
            tipo: new FormControl('', Validators.required),
            tel: new FormControl('', Validators.required),
            buscabanco: new FormControl(''),
            email: new FormControl('')
            // tipopix: new FormControl(''),
            // chavepix: new FormControl(''),
            // banco: new FormControl(''),
            // agencia: new FormControl(''),
            // conta: new FormControl(''),
        });
        this.buscaRelatorioEstornosForm = new FormGroup({
            dtinicio: new FormControl(today, Validators.required),
            dtfim: new FormControl(today, Validators.required),
            valinicio: new FormControl(0),
            valfim: new FormControl(0),
            unidade: new FormControl('todas')
        });

        console.log(this.bancoarray.length);
        console.log(this.exEstornoForm.controls['buscabanco'].value.length);
        console.log(today);
        this.auditForm.controls["dtinicio"].setValue(today);
        this.auditForm.controls["dtfim"].setValue(today);
        this.userdata = null;
        this.objuser = [];
        this.buscausuario = null;
        this.getJurosTaxas();
        this.setTaxasAdmin();
    }
    getSessionItem() {
        //let temp: any = sessionStorage.getItem('login');
        //this.user = JSON.parse(temp);
        let token: any = sessionStorage.getItem('token');
        let checktoken = JSON.parse(JSON.stringify(jwt_decode(token)));
        this.role = checktoken.tipo;
        this.user = {
            nome: checktoken.nome,
            username: checktoken.username,
            unidade: checktoken.unidade,
        }
        console.log(this.role);
        console.log(this.user);
        console.log(this.user.nome);
        console.log(this.user.username);
        console.log(this.user.unidade);
        console.log(token);
    }
    resetPassword() {
        this.getSessionItem();
        let username = this.user.username;
        console.log(username);
        let currpwda = this.resetpwdForm.controls["oldpwd"].value;
        let currpwdb = this.resetpwdForm.controls["oldpwdconfirm"].value;
        if (currpwda == currpwdb) {
            this.service.getUser(username).subscribe(u => {
                console.log(u);
                let today = new Date();
                if (currpwda == u.pwd && currpwdb == u.pwd) {
                    let objuser = {
                        nome: u.nome,
                        cpf: u.cpf,
                        username: u.username,
                        pwd: this.resetpwdForm.controls["newpwd"].value,
                        tipo: u.tipo,
                        unidade: u.unidade,
                        stats: u.stats,
                        updatedat: today
                    }
                    const obj = JSON.stringify(objuser);
                    console.log(objuser);
                    console.log(obj);
                    this.service.updateUser(obj).subscribe(result => {
                        console.log(result);

                        let logobj = {
                            objeto: 'Usuário',
                            operacao: 'Edição',
                            descricao: "Usuário atualizou sua senha de acesso"
                        }
                        this.service.createLogObj(logobj).subscribe(u => {
                            console.log(u);
                            alert("Senha atualizada com sucesso")
                            sessionStorage.removeItem('token');
                            sessionStorage.removeItem('login');
                            this.router.navigate(['/login']);
                        });
                    },
                        (error) => {
                            alert("Erro ao atualizar senha")
                        });
                }
                else {
                    alert("Senha incorreta");
                }

            });
        }
        else {
            alert("Senhas diferentes");
        }
    }
    changeUnidade(user: any, index: any) {
        console.log(user);
        const dialogRef = this.dialog.open(ModalunidadeComponent, {
            data: {
                unidade: '',
                modaltxt: "Selecione a nova unidade do funcionário " + user.nome + ":"
            },
            panelClass: 'simplemodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result != '' && result != null) {
                const newunidade = result;
                console.log(newunidade);
                let auditobj = "Usuário";
                let auditoperacao = "Alteração de unidade";
                let audittxt = "Alteração de unidade do funcionário: " + user.nome + " - usuário: " + user.username + " - CPF: " + user.cpf + ". Alterado de " + user.unidade + " para " + newunidade + ".";
                let obj = {
                    targetuser: user.username,
                    targetunidade: newunidade,
                    user: this.user.username,
                    audittxt: audittxt,
                    auditobj: auditobj,
                    auditoperacao: auditoperacao
                }
                this.service.updateUserUnidade(obj).subscribe(u => {
                    this.objuser[index].unidade = newunidade;
                    console.log(u);
                    alert("Unidade alterada com sucesso");
                    if (user.username == this.user.username) {
                        sessionStorage.removeItem('token');
                        sessionStorage.removeItem('login');
                        this.router.navigate(['/login']);
                    }
                },
                    (error) => {
                        console.log(error);
                        alert("Erro ao alterar unidade")
                    });
            }
        });
    }
    userChange(type: any) {
        if (type == 'admin') {
            let i = this.newuserForm.controls["tipo"].value;
            console.log(i);
            console.log(this.usertypes[i]);
            if (this.usertypes[i].has_unidade == 1) {
                this.showunidade = 1;
            }
            if (this.usertypes[i].has_unidade == 0) {
                this.showunidade = 0;
            }
        }
    }
    getJurosTaxas() {
        this.service.getTaxas().subscribe(t => {
            // //console.log(t.Valores[0]);
            this.taxas = t.Valores[0];
            // //console.log(this.taxas.juros2a4);
            this.configfinForm.controls["cata"].setValue(this.taxas.juros2a4);
        });
    }
    setTaxasAdmin() {
        this.service.getTaxas().subscribe(t => {
            // //console.log(t.Valores[0]);
            this.taxas = t.Valores[0];
            // //console.log(this.taxas.juros2a4);
            this.configfinForm.controls["cata"].setValue(this.taxas.juros2a4);
            this.configfinForm.controls["catb"].setValue(this.taxas.juros5a8);
            this.configfinForm.controls["catc"].setValue(this.taxas.juros9a12);
            this.configfinForm.controls["catd"].setValue(this.taxas.juros13a16);
            this.configfinForm.controls["cate"].setValue(this.taxas.juros17a20);
            this.configfinForm.controls["catf"].setValue(this.taxas.juros21a24);
            this.configfinTaxaForm.controls["taxa"].setValue(this.taxas.taxaadicional);
            this.configfinCatForm.controls["boleto"].setValue(this.taxas.jurosboleto);
            this.configfinCatForm.controls["cheque"].setValue(this.taxas.juroscheque);
        });

    }
    setTaxas() {
        this.service.getTaxas().subscribe(t => {
            // //console.log(t.Valores[0]);
            let temptaxas = t.Valores[0];
            let tjuros2a4 = (temptaxas.juros2a4 * 100).toFixed(2);
            let tjuros5a8 = (temptaxas.juros5a8 * 100).toFixed(2);
            let tjuros9a12 = (temptaxas.juros9a12 * 100).toFixed(2);
            let tjuros13a16 = (temptaxas.juros13a16 * 100).toFixed(2);
            let tjuros17a20 = (temptaxas.juros17a20 * 100).toFixed(2);
            let tjuros21a24 = (temptaxas.juros21a24 * 100).toFixed(2);
            let tjurosboleto = (temptaxas.jurosboleto * 100).toFixed(2);
            let tjuroscheque = (temptaxas.juroscheque * 100).toFixed(2);
            let ttaxaadicional = temptaxas.taxaadicional;
            let objtemp = {
                juros2a4: tjuros2a4,
                juros5a8: tjuros5a8,
                juros9a12: tjuros9a12,
                juros13a16: tjuros13a16,
                juros17a20: tjuros17a20,
                juros21a24: tjuros21a24,
                jurosboleto: tjurosboleto,
                juroscheque: tjuroscheque,
                taxaadicional: ttaxaadicional
            }
            this.taxas = objtemp;
            // //console.log(this.taxas.juros2a4);
            this.configfinForm.controls["cata"].setValue(this.taxas.juros2a4);
            this.configfinForm.controls["catb"].setValue(this.taxas.juros5a8);
            this.configfinForm.controls["catc"].setValue(this.taxas.juros9a12);
            this.configfinForm.controls["catd"].setValue(this.taxas.juros13a16);
            this.configfinForm.controls["cate"].setValue(this.taxas.juros17a20);
            this.configfinForm.controls["catf"].setValue(this.taxas.juros21a24);
            this.configfinTaxaForm.controls["taxa"].setValue(this.taxas.taxaadicional);
            this.configfinCatForm.controls["boleto"].setValue(this.taxas.jurosboleto);
            this.configfinCatForm.controls["cheque"].setValue(this.taxas.juroscheque);
        });

    }
    produtoList(unidade: any) {
        this.sloader = 1;
        //let prodarray = [];
        this.prodlist = [];
        let objunidade = '';
        this.objunidade = '';
        let text = '';
        this.prodtxt = '';
        this.showprodlist = 0;
        if (unidade == 'prodni1') {
            objunidade = "prodni1";
            text = 'Nova Iguaçu I';
        }
        if (unidade == 'prodni2') {
            objunidade = "prodni2";
            text = 'Nova Iguaçu II';
        }
        if (unidade == 'prodni3') {
            objunidade = "prodni3";
            text = 'Nova Iguaçu III';
        }
        if (unidade == 'prodbel') {
            objunidade = "prodbel";
            text = 'Belford Roxo';
        }
        if (unidade == 'prodsjm') {
            objunidade = "prodsjm";
            text = 'São João de Meriti';
        }
        if (unidade == 'prodvilar') {
            objunidade = "prodvilar";
            text = 'Vilar dos Teles';
        }
        if (unidade == 'prodni4') {
            objunidade = "prodni4";
            text = 'Nova Iguaçu IV';
        }
        if (unidade == 'prodpav') {
            objunidade = "prodpav";
            text = 'Pavuna';
        }
        if (unidade == 'prodpartmed') {
            objunidade = "prodpartmed";
            text = 'Partmed';
        }
        let obj = {
            unidade: objunidade
        }
        this.service.getProdutosByUnidade(obj).subscribe(p => {
            console.log(p);
            this.objunidade = objunidade;
            this.showprodlist = 1;
            this.prodlist = p.Produtos;
            this.prodtxt = text;
            this.sloader = 0;
        },
            (error) => {
                this.showprodlist = 0;
                console.log(error);
                this.objunidade = '';
                // console.log(error.error.text)
                // let errorstr = error.error.text;
                // if (errorstr.includes('Database could not be connected')) {
                //   alert("Erro de conexão ao banco de dados");
                // }
                alert("Erro de conexão ao banco de dados");
                this.sloader = 0;
            });
    }
    newFinanciador() {
        const dialogRef = this.dialog.open(ModalfinanciadorComponent, {
            data: {
                operacao: 'insert',
                id: '',
                nome: '',
                user: this.user.username
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                this.service.newFinanciadores(obj).subscribe(f => {
                    console.log(f);
                    if (f.status == 'ok') {
                        let newfin = {
                            id: f.id,
                            nome: result.nome
                        };
                        this.financiadores.push(newfin);
                        alert("Financiador cadastrado com sucesso")
                        this.sloader = 0;
                    }
                    else {
                        this.sloader = 0;
                        alert("Erro ao cadastrar financiador");
                    }
                },
                    (error) => {
                        console.log(error);
                        alert("Erro ao cadastrar financiador");
                    });
            }
        });
    }

    deleteFinanciador(financiador: any, index: any) {
        const dialogRef = this.dialog.open(ModalfinanciadorComponent, {
            data: {
                operacao: 'delete',
                id: financiador.id,
                nome: financiador.nome,
                user: this.user.username
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                this.service.delFinanciadores(obj).subscribe(f => {
                    console.log(f);
                    if (f.status == 'ok') {
                        this.financiadores.splice(index, 1);
                        alert("Financiador excluido com sucesso")
                        this.sloader = 0;
                    }
                    else {
                        this.sloader = 0;
                        alert("Erro ao excluir financiador");
                    }
                },
                    (error) => {
                        console.log(error);
                        alert("Erro ao excluir financiador");
                    });
            }
        });
    }
    newLaboratorio() {
        const dialogRef = this.dialog.open(ModallaboratorioComponent, {
            data: {
                operacao: 'insert',
                id: '',
                nome: '',
                user: this.user.username
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                this.service.newLaboratorios(obj).subscribe(f => {
                    console.log(f);
                    if (f.status == 'ok') {
                        let newlab = {
                            id: f.id,
                            nome: result.nome
                        };
                        this.laboratorios.push(newlab);
                        alert("Laboratório cadastrado com sucesso")
                        this.sloader = 0;
                    }
                    else {
                        this.sloader = 0;
                        alert("Erro ao cadastrar laboratório");
                    }
                },
                    (error) => {
                        console.log(error);
                        alert("Erro ao cadastrar laboratório");
                    });
            }
        });
    }

    deleteLaboratorio(laboratorio: any, index: any) {
        const dialogRef = this.dialog.open(ModallaboratorioComponent, {
            data: {
                operacao: 'delete',
                id: laboratorio.id,
                nome: laboratorio.nome,
                user: this.user.username
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                this.service.delLaboratorios(obj).subscribe(f => {
                    console.log(f);
                    if (f.status == 'ok') {
                        this.laboratorios.splice(index, 1);
                        alert("Laboratório excluido com sucesso")
                        this.sloader = 0;
                    }
                    else {
                        this.sloader = 0;
                        alert("Erro ao excluir laboratório");
                    }
                },
                    (error) => {
                        console.log(error);
                        alert("Erro ao excluir laboratório");
                    });
            }
        });
    }
    newProdOs() {
        const dialogRef = this.dialog.open(ModalprodosComponent, {
            data: {
                operacao: 'insert',
                id: '',
                nome: '',
                user: this.user.username
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                this.service.newProdOs(obj).subscribe(f => {
                    console.log(f);
                    if (f.status == 'ok') {
                        let prodos = {
                            id: f.id,
                            valor: result.valor,
                            nome: result.nome
                        };
                        this.produtosordemservico.push(prodos);
                        alert("Produto de ordem de serviço cadastrado com sucesso")
                        this.sloader = 0;
                    }
                    else {
                        this.sloader = 0;
                        alert("Erro ao cadastrar produto de ordem de serviço");
                    }
                },
                    (error) => {
                        console.log(error);
                        alert("Erro ao cadastrar produto de ordem de serviço");
                    });
            }
        });
    }

    deleteProdOs(prodos: any, index: any) {
        const dialogRef = this.dialog.open(ModalprodosComponent, {
            data: {
                operacao: 'delete',
                id: prodos.id,
                nome: prodos.nome,
                valor: prodos.valor,
                user: this.user.username
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                this.service.delProdOs(obj).subscribe(f => {
                    console.log(f);
                    if (f.status == 'ok') {
                        this.produtosordemservico.splice(index, 1);
                        alert("Produto de ordem de serviço excluido com sucesso")
                        this.sloader = 0;
                    }
                    else {
                        this.sloader = 0;
                        alert("Erro ao excluir produto de ordem de serviço");
                    }
                },
                    (error) => {
                        console.log(error);
                        alert("Erro ao excluir produto de ordem de serviço");
                    });
            }
        });
    }
    newBanco() {
        const dialogRef = this.dialog.open(ModalbancoComponent, {
            data: {
                operacao: 'insert',
                id: '',
                nome: '',
                codigo: '',
                user: this.user.username
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                this.service.newBancos(obj).subscribe(f => {
                    console.log(f);
                    if (f.status == 'ok') {
                        let newentr = {
                            id: f.id,
                            nome: result.nome,
                            codigo: result.codigo
                        };
                        this.bancos.push(newentr);
                        alert("Entrada cadastrada com sucesso")
                        this.sloader = 0;
                    }
                    else {
                        this.sloader = 0;
                        alert("Erro ao cadastrar entrada");
                    }
                },
                    (error) => {
                        console.log(error);
                        alert("Erro ao cadastrar entrada");
                    });
            }
        });
    }
    deleteBanco(banco: any, index: any) {
        const dialogRef = this.dialog.open(ModalbancoComponent, {
            data: {
                operacao: 'delete',
                id: banco.id,
                nome: banco.nome,
                codigo: banco.codigo,
                user: this.user.username
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                this.service.delBancos(obj).subscribe(f => {
                    console.log(f);
                    if (f.status == 'ok') {
                        this.bancos.splice(index, 1);
                        alert("Banco excluido com sucesso")
                        this.sloader = 0;
                    }
                    else {
                        this.sloader = 0;
                        alert("Erro ao excluir banco");
                    }
                },
                    (error) => {
                        console.log(error);
                        alert("Erro ao excluir banco");
                    });
            }
        });
    }
    newEntrada() {
        const dialogRef = this.dialog.open(ModalentradaconfComponent, {
            data: {
                operacao: 'insert',
                id: '',
                nome: '',
                user: this.user.username
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                this.service.newEntradas(obj).subscribe(f => {
                    console.log(f);
                    if (f.status == 'ok') {
                        let newentr = {
                            id: f.id,
                            nome: result.nome
                        };
                        this.entradas.push(newentr);
                        alert("Entrada cadastrada com sucesso")
                        this.sloader = 0;
                    }
                    else {
                        this.sloader = 0;
                        alert("Erro ao cadastrar entrada");
                    }
                },
                    (error) => {
                        console.log(error);
                        alert("Erro ao cadastrar entrada");
                    });
            }
        });
    }

    deleteEntrada(entrada: any, index: any) {
        const dialogRef = this.dialog.open(ModalentradaconfComponent, {
            data: {
                operacao: 'delete',
                id: entrada.id,
                nome: entrada.nome,
                user: this.user.username
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                this.service.delEntradas(obj).subscribe(f => {
                    console.log(f);
                    if (f.status == 'ok') {
                        this.entradas.splice(index, 1);
                        alert("Entrada excluida com sucesso")
                        this.sloader = 0;
                    }
                    else {
                        this.sloader = 0;
                        alert("Erro ao excluir entrada");
                    }
                },
                    (error) => {
                        console.log(error);
                        alert("Erro ao excluir entrada");
                    });
            }
        });
    }

    newProdutoModal(unidade: any) {
        const dialogRef = this.dialog.open(ModalnewprodutoComponent, {
            data: {
                unidade: unidade,
                unidadetxt: this.prodtxt,
                user: this.user.username,
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                let produto = result.produto;
                this.service.newProduto(obj).subscribe(p => {
                    console.log(p);
                    if (p.status == "ok") {
                        this.prodlist.push(produto);
                        this.sloader = 0;
                        alert("Produto cadastrado com sucesso");
                    }
                    if (p.status == "error") {
                        this.sloader = 0;
                        alert("Erro ao cadastrar produto");
                    }
                },
                    (error) => {
                        this.sloader = 0;
                        console.log(error);
                        alert("Erro ao cadastrar produto");
                    });
            }
        });
    }
    editProdutoModal(produto: any, index: any) {

        const dialogRef = this.dialog.open(ModaleditprodutoComponent, {
            data: {
                produto: produto.produto,
                nome: produto.nome,
                valor: produto.valor,
                grupo: produto.grupo,
                unidade: this.objunidade,
                user: this.user.username
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                let produto = result.produto;
                this.service.editProduto(obj).subscribe(p => {
                    console.log(p);
                    if (p.status == "ok") {
                        this.prodlist[index] = produto;
                        this.sloader = 0;
                        alert("Produto editado com sucesso");
                    }
                    if (p.status == "error") {
                        this.sloader = 0;
                        alert("Erro ao editar produto");
                    }
                },
                    (error) => {
                        this.sloader = 0;
                        console.log(error);
                        alert("Erro ao editar produto");
                    });
            }
        });
    }
    deleteProdutoModal(produto: any, index: any) {
        const dialogRef = this.dialog.open(ModaldelprodutoComponent, {
            data: {
                produto: produto.produto,
                nome: produto.nome,
                valor: produto.valor,
                grupo: produto.grupo,
                unidade: this.objunidade,
                user: this.user.username
                //unidadetxt: this.prodtxt
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                let produto = result.produto;
                this.service.delProduto(obj).subscribe(p => {
                    console.log(p);
                    if (p.status == "ok") {
                        this.prodlist.splice(index, 1);
                        this.sloader = 0;
                        alert("Produto excluido com sucesso");
                    }
                    if (p.status == "error") {
                        this.sloader = 0;
                        alert("Erro ao excluir produto");
                    }
                },
                    (error) => {
                        this.sloader = 0;
                        console.log(error);
                        alert("Erro ao excluir produto");
                    });
            }
        });
    }

    checkTaxaChanges(objj: any) {

        // let objjtemp = {
        //   juros2a4: (objj.juros2a4 / 100).toFixed(4),
        //   juros5a8: (objj.juros5a8 / 100).toFixed(4),
        //   juros9a12: (objj.juros9a12 / 100).toFixed(4),
        //   juros13a16: (objj.juros13a16 / 100).toFixed(4),
        //   juros17a20: (objj.juros17a20 / 100).toFixed(4),
        //   juros21a24: (objj.juros21a24 / 100).toFixed(4),
        //   jurosboleto: (objj.jurosboleto / 100).toFixed(4),
        //   juroscheque: (objj.juroscheque / 100).toFixed(4),
        //   taxaadicional: objj.taxaadicional
        // }

        let obj = objj;
        if (
            obj.juros2a4 != this.taxas.juros2a4 || obj.juros5a8 != this.taxas.juros5a8 || obj.juros9a12 != this.taxas.juros9a12 || obj.juros13a16 != this.taxas.juros13a16 || obj.juros17a20 != this.taxas.juros17a20 || obj.juros21a24 != this.taxas.juros21a24 || obj.jurosboleto != this.taxas.jurosboleto || obj.juroscheque != this.taxas.juroscheque || obj.taxaadicional != this.taxas.taxaadicional) {
            // //console.log(objj);
            console.log(obj);
            console.log(this.taxas);
            return true;
        }
        else {
            console.log(obj);
            console.log(this.taxas);
            return false;
        }
    }
    editTaxaOld() {
        let objedit = {
            juros2a4: this.configfinForm.controls["cata"].value,
            juros5a8: this.configfinForm.controls["catb"].value,
            juros9a12: this.configfinForm.controls["catc"].value,
            juros13a16: this.configfinForm.controls["catd"].value,
            juros17a20: this.configfinForm.controls["cate"].value,
            juros21a24: this.configfinForm.controls["catf"].value,
            taxaadicional: this.configfinTaxaForm.controls["taxa"].value,
            jurosboleto: this.configfinCatForm.controls["boleto"].value,
            juroscheque: this.configfinCatForm.controls["cheque"].value,
            lasteditedby: this.user.username
        }
        let isvalid = this.checkTaxaChanges(objedit);
        if (isvalid == true) {
            //
            const dialogRef = this.dialog.open(ModaledittaxaComponent, {
                data: {
                    oldentry: this.taxas,
                    newentry: objedit,
                },
                panelClass: 'edittaxamodal'
            });
            dialogRef.afterClosed().subscribe(result => {
                console.log(result);
                let oldo = result.objb;
                let newo = result.obj;
                let auditobj = "Taxas e Juros";
                let auditoperacao = "Edição";
                let audittxt = "Edição de taxas e juros. 2 a 4 parcelas: " + newo.juros2a4 + "% - 5 a 8 parcelas " + newo.juros5a8 + "% - 9 a 12 parcelas " + newo.juros9a12 + "% - 13 a 16 parcelas " + newo.juros13a16 + "% - 17 a 20 parcelas " + newo.juros17a20 + "% - 21 a 24 parcelas " + newo.juros21a24 + "% - No boleto: " + newo.jurosboleto + "% - No cheque " + newo.juroscheque + "% - Taxa adicional " + formatCurrency(newo.taxaadicional, 'pt-BR', 'R$') + "";
                let user = this.user.username;
                if (result) {
                    let obj = {
                        juros2a4: (objedit.juros2a4 / 100).toFixed(4),
                        juros5a8: (objedit.juros5a8 / 100).toFixed(4),
                        juros9a12: (objedit.juros9a12 / 100).toFixed(4),
                        juros13a16: (objedit.juros13a16 / 100).toFixed(4),
                        juros17a20: (objedit.juros17a20 / 100).toFixed(4),
                        juros21a24: (objedit.juros21a24 / 100).toFixed(4),
                        jurosboleto: (objedit.jurosboleto / 100).toFixed(4),
                        juroscheque: (objedit.juroscheque / 100).toFixed(4),
                        taxaadicional: objedit.taxaadicional,
                        lastupdatedby: user,
                        auditobj: auditobj,
                        auditoperacao: auditoperacao,
                        audittxt: audittxt,
                        user: user
                    }
                    console.log(obj);
                    this.service.updateTaxas(obj).subscribe(async u => {
                        let status = u.status;
                        if (status == "ok") {
                            this.taxas = {
                                juros2a4: (Number(obj.juros2a4) * 100).toFixed(2),
                                juros5a8: (Number(obj.juros5a8) * 100).toFixed(2),
                                juros9a12: (Number(obj.juros9a12) * 100).toFixed(2),
                                juros13a16: (Number(obj.juros13a16) * 100).toFixed(2),
                                juros17a20: (Number(obj.juros17a20) * 100).toFixed(2),
                                juros21a24: (Number(obj.juros21a24) * 100).toFixed(2),
                                jurosboleto: (Number(obj.jurosboleto) * 100).toFixed(2),
                                juroscheque: (Number(obj.juroscheque) * 100).toFixed(2),
                                taxaadicional: Number(obj.taxaadicional),
                                lastupdatedby: obj.lastupdatedby
                            }
                            console.log(this.taxas);
                            await alert("Dados financeiros alterados com sucesso")
                        }
                        else {
                            alert("Erro ao atualizar dados financeiros")
                        }
                        //alert('Worked!')
                    })
                }
            });

        }
        if (isvalid == false) {
            alert('Altere algum valor para prosseguir');
        }
    }
    editTaxa() {
        let objedit = {
            juros2a4: this.configfinForm.controls["cata"].value,
            juros5a8: this.configfinForm.controls["catb"].value,
            juros9a12: this.configfinForm.controls["catc"].value,
            juros13a16: this.configfinForm.controls["catd"].value,
            juros17a20: this.configfinForm.controls["cate"].value,
            juros21a24: this.configfinForm.controls["catf"].value,
            taxaadicional: this.configfinTaxaForm.controls["taxa"].value,
            jurosboleto: this.configfinCatForm.controls["boleto"].value,
            juroscheque: this.configfinCatForm.controls["cheque"].value,
            lasteditedby: this.user.username
        }
        let isvalid = this.checkTaxaChanges(objedit);
        if (isvalid == true) {
            //
            const dialogRef = this.dialog.open(ModaledittaxaComponent, {
                data: {
                    oldentry: this.taxas,
                    newentry: objedit,
                },
                panelClass: 'edittaxamodal'
            });
            dialogRef.afterClosed().subscribe(result => {
                console.log(result);
                let oldo = result.objb;
                let newo = result.obj;
                let auditobj = "Taxas e Juros";
                let auditoperacao = "Edição";
                let audittxt = "Edição de taxas e juros. 2 a 4 parcelas: " + newo.juros2a4 + "% - 5 a 8 parcelas " + newo.juros5a8 + "% - 9 a 12 parcelas " + newo.juros9a12 + "% - 13 a 16 parcelas " + newo.juros13a16 + "% - 17 a 20 parcelas " + newo.juros17a20 + "% - 21 a 24 parcelas " + newo.juros21a24 + "% - No boleto: " + newo.jurosboleto + "% - No cheque " + newo.juroscheque + "% - Taxa adicional " + formatCurrency(newo.taxaadicional, 'pt-BR', 'R$') + "";
                let user = this.user.username;
                if (result) {
                    let obj = {
                        juros2a4: objedit.juros2a4,
                        juros5a8: objedit.juros5a8,
                        juros9a12: objedit.juros9a12,
                        juros13a16: objedit.juros13a16,
                        juros17a20: objedit.juros17a20,
                        juros21a24: objedit.juros21a24,
                        jurosboleto: objedit.jurosboleto,
                        juroscheque: objedit.juroscheque,
                        taxaadicional: objedit.taxaadicional,
                        lastupdatedby: user,
                        auditobj: auditobj,
                        auditoperacao: auditoperacao,
                        audittxt: audittxt,
                        user: user
                    }
                    console.log(obj);
                    this.service.updateTaxas(obj).subscribe(async u => {
                        let status = u.status;
                        if (status == "ok") {
                            this.taxas = {
                                juros2a4: obj.juros2a4,
                                juros5a8: obj.juros5a8,
                                juros9a12: obj.juros9a12,
                                juros13a16: obj.juros13a16,
                                juros17a20: obj.juros17a20,
                                juros21a24: obj.juros21a24,
                                jurosboleto: obj.jurosboleto,
                                juroscheque: obj.juroscheque,
                                taxaadicional: obj.taxaadicional,
                                lastupdatedby: obj.lastupdatedby
                            }
                            console.log(this.taxas);
                            await alert("Dados financeiros alterados com sucesso")
                        }
                        else {
                            alert("Erro ao atualizar dados financeiros")
                        }
                        //alert('Worked!')
                    })
                }
            });

        }
        if (isvalid == false) {
            alert('Altere algum valor para prosseguir');
        }
    }
    createNewUser() {
        console.log(this.newuserForm.controls["nome"].value);
        console.log(this.newuserForm.controls["cpf"].value);
        console.log(this.newuserForm.controls["username"].value);
        console.log(this.newuserForm.controls["tipo"].value);
        console.log(this.newuserForm.controls["unidade"].value);
        if (this.newuserForm.valid) {
            this.sloader = 1;
            let unidade;
            if (this.usertypes[this.newuserForm.controls["tipo"].value].has_unidade == 0) {
                unidade = null;
            }
            if (this.usertypes[this.newuserForm.controls["tipo"].value].has_unidade == 1) {
                unidade = this.newuserForm.controls["unidade"].value;
            }
            let objuser = {
                nome: this.newuserForm.controls["nome"].value,
                cpf: this.newuserForm.controls["cpf"].value,
                username: this.newuserForm.controls["username"].value,
                pwd: this.newuserForm.controls["cpf"].value,
                tipo: this.usertypes[this.newuserForm.controls["tipo"].value].val,
                stats: 'ativo',
                unidade: unidade
            }
            const username = objuser.username;
            this.service.checkUser(username).subscribe(founduser => {
                console.log(founduser);
                console.log(founduser.username);
                if (founduser.username == null || founduser.username == undefined) {
                    const obj = JSON.stringify(objuser);
                    console.log(objuser);
                    console.log(obj);
                    this.service.createUser(obj).subscribe(u => {
                        console.log(u);
                        let user = JSON.parse(obj);

                        let logobj = {
                            objeto: 'Usuário',
                            operacao: 'Criação',
                            descricao: "Criaçao do usuário " + user.username + " - tipo: " + user.tipo + " - Unidade: " + user.unidade + ""
                        }
                        this.service.createLogObj(logobj).subscribe(u => {
                            this.sloader = 0;
                            console.log(u);
                            alert('Usuário cadastrado com sucesso');
                            this.newuserForm.reset();
                        });
                    });
                }
                else {
                    this.sloader = 0;
                    alert("Usuário já encontra-se cadastrado no sistema")
                }
            });
        }
        else {
            alert("Preencha todos os campos")
        }
    }
    createNewUserGere() {
        if (this.newusergForm.valid) {
            this.sloader = 1;
            let objuser = {
                nome: this.newusergForm.controls["nome"].value,
                cpf: this.newusergForm.controls["cpf"].value,
                username: this.newusergForm.controls["username"].value,
                pwd: this.newusergForm.controls["cpf"].value,
                tipo: 'comercial',
                stats: 'ativo',
                unidade: this.user.unidade
            }
            const username = objuser.username;
            this.service.checkUser(username).subscribe(founduser => {
                console.log(founduser);
                console.log(founduser.username);
                if (founduser.username == null || founduser.username == undefined) {
                    const obj = JSON.stringify(objuser);
                    console.log(objuser);
                    console.log(obj);
                    this.service.createUser(obj).subscribe(u => {
                        console.log(u);
                        let user = JSON.parse(obj);

                        let logobj = {
                            objeto: 'Usuário',
                            operacao: 'Criação',
                            descricao: "Criaçao do usuário " + user.username + " - tipo: " + user.tipo + " - Unidade: " + user.unidade + ""
                        }
                        this.service.createLogObj(logobj).subscribe(u => {
                            this.sloader = 0;
                            console.log(u);
                            alert('Usuário cadastrado com sucesso');
                            this.newusergForm.reset();
                        });
                    });
                }
                else {
                    this.sloader = 1;
                    alert("Usuário já encontra-se cadastrado no sistema")
                }
            });
        }
        else {
            alert("Preencha todos os campos")
        }
    }
    fixTaxaParcelas() {
        let cata = this.configfinForm.controls["cata"];
        let catb = this.configfinForm.controls["catb"];
        let catc = this.configfinForm.controls["catc"];
        let catd = this.configfinForm.controls["catd"];
        let cate = this.configfinForm.controls["cate"];
        let catf = this.configfinForm.controls["catf"];
        if (cata.value > catb.value) {
            catb.setValue(cata.value);
            catc.setValue(cata.value);
            catd.setValue(cata.value);
            cate.setValue(cata.value);
            catf.setValue(cata.value);
        }
        else if (catb.value > catc.value) {
            catc.setValue(catb.value);
            catd.setValue(catb.value);
            cate.setValue(catb.value);
            catf.setValue(catb.value);
        }
        else if (catc.value > catd.value) {
            catd.setValue(catc.value);
            cate.setValue(catc.value);
            catf.setValue(catc.value);
        }
        else if (catd.value > cate.value) {
            cate.setValue(catd.value);
            catf.setValue(catd.value);
        }
        else if (cate.value > catf.value) {
            catf.setValue(cate.value);
        }


    }
    fixPercentage(categoria: any) {
        console.log(this.configfinForm.controls["" + categoria + ""].value);
        if (this.configfinForm.controls["" + categoria + ""].value > 100) {
            this.configfinForm.controls["" + categoria + ""].setValue(100);
        }
        if (this.configfinForm.controls["" + categoria + ""].value < 0) {
            this.configfinForm.controls["" + categoria + ""].setValue(0);
        }
        console.log(this.configfinForm.controls["" + categoria + ""].value);
    }
    fixPercentageCat(categoria: any) {
        console.log(this.configfinCatForm.controls["" + categoria + ""].value);
        if (this.configfinCatForm.controls["" + categoria + ""].value > 100) {
            this.configfinCatForm.controls["" + categoria + ""].setValue(100);
        }
        if (this.configfinCatForm.controls["" + categoria + ""].value < 0) {
            this.configfinCatForm.controls["" + categoria + ""].setValue(0);
        }
        console.log(this.configfinCatForm.controls["" + categoria + ""].value);
    }
    cpfValid() {
        const cpf = this.newuserForm.controls["cpf"].value;
        console.log(this.newuserForm.controls["cpf"].value);
        console.log(cpf);
        // validate(cpf);
        if ((cpf != null || cpf == '' || cpf != undefined) && !validate(cpf)) {
            this.newuserForm.controls["cpf"].setValue(null);
            //this.usercpf.nativeElement.focus();
            alert("CPF inválido")

        }
    }
    getUserList() {
        if (this.searchuserForm.controls["userbusca"].value.length > 0) {
            this.sloader = 0;
            this.objuser = [];
            this.buscausuario = this.searchuserForm.controls["userbusca"].value;
            let query = this.searchuserForm.controls["usercriteria"].value;
            let busca = this.buscausuario;
            if (busca.length > 0) {
                this.sloader = 1;
                this.service.getUserList(busca, query).subscribe(u => {

                    // console.log(u.Users);
                    // console.log(u.Users[1]);
                    this.objuser = u.Users;
                    console.log(this.objuser);
                    this.sloader = 0;
                },
                    (error) => {
                        console.log(error);
                        this.sloader = 0;
                    });
            }
        }
    }

    getUserListGerente() {
        if (this.searchuserForm.controls["userbusca"].value.length > 0) {
            this.sloader = 0;
            this.objuser = [];
            this.buscausuario = this.searchuserForm.controls["userbusca"].value;
            let query = this.searchuserForm.controls["usercriteria"].value;
            let busca = this.buscausuario;
            let unidade = this.user.unidade;
            console.log(unidade);
            let obj = {
                query: query,
                busca: busca,
                unidade: unidade
            }
            console.log(obj);
            if (busca.length > 0) {
                this.sloader = 1;
                this.service.getUserListUnidade(obj).subscribe(u => {
                    console.log(u.Users);
                    // console.log(u.Users[1]);
                    this.objuser = u.Users;
                    console.log(this.objuser);
                    this.sloader = 0;
                },
                    (error) => {
                        console.log(error);
                        this.sloader = 0;
                    });
            }
        }
    }

    ativaUsuario(usuario: any, index: any) {
        let text = "Deseja ativar este usuário?"

        const dialogRef = this.dialog.open(AdminmodalComponent, {
            data: { text: text }
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log("The dialog was closed");

            console.log(result);
            if (result) {
                usuario.stats = 'ativo';
                this.service.updateUser(usuario).subscribe(result => {
                    console.log(result);
                    let logobj = {
                        objeto: 'Usuário',
                        operacao: 'Ativação',
                        descricao: "Ativação do usuário " + usuario.username + ""
                    }
                    this.service.createLogObj(logobj).subscribe(u => {
                        console.log(u);
                        alert("Usuário ativado com sucesso")
                        let curruser = this.auth.getSessionItem();
                        let currusername = curruser.username;
                        let objusername = usuario.username;
                        if (currusername == objusername) {
                            sessionStorage.removeItem('token');
                            sessionStorage.removeItem('login');
                            this.router.navigate(['/login']);
                        }
                        if (currusername != objusername) {
                            this.getUserList();
                        }
                    });
                },
                    (error) => {
                        alert("Erro ao ativar usuário")
                    });

            }
        });
    }
    desativaUsuario(usuario: any, index: any) {
        let text = "Deseja desativar este usuário?"

        const dialogRef = this.dialog.open(AdminmodalComponent, {
            data: { text: text },
            panelClass: 'simplemodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log("The dialog was closed");
            console.log(result);
            if (result) {
                usuario.stats = 'inativo';
                this.service.updateUser(usuario).subscribe(result => {
                    console.log(result);
                    let logobj = {
                        objeto: 'Usuário',
                        operacao: 'Desativação',
                        descricao: "Desativação do usuário " + usuario.username + ""
                    }
                    this.service.createLogObj(logobj).subscribe(u => {
                        console.log(u);
                        alert("Usuário desativado com sucesso")
                        let curruser = this.auth.getSessionItem();
                        let currusername = curruser.username;
                        let objusername = usuario.username;
                        if (currusername == objusername) {
                            sessionStorage.removeItem('token');
                            sessionStorage.removeItem('login');
                            this.router.navigate(['/login']);
                        }
                        if (currusername != objusername) {
                            this.getUserList();
                        }
                    });
                },
                    (error) => {
                        alert("Erro ao desativar usuário")
                    });

            }
        });

    }

    userPwdReset(usuario: any, index: any) {
        let text = "Deseja redefinir a senha para este usuário?"

        const dialogRef = this.dialog.open(AdminmodalComponent, {
            data: { text: text },
            panelClass: 'simplemodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log("The dialog was closed");
            console.log(result);
            if (result) {
                console.log(usuario);
                usuario.pwd = usuario.cpf;
                console.log(usuario);
                this.service.updateUser(usuario).subscribe(result => {
                    console.log(result);
                    let logobj = {
                        objeto: 'Usuário',
                        operacao: 'Edição',
                        descricao: "Redefinição de senha de acesso do usuário " + usuario.username + ""
                    }
                    this.service.createLogObj(logobj).subscribe(u => {
                        console.log(u);
                        alert("Senha redefinida com sucesso")
                        let curruser = this.auth.getSessionItem();
                        let currusername = curruser.username;
                        let objusername = usuario.username;
                        if (currusername == objusername) {
                            sessionStorage.removeItem('token');
                            sessionStorage.removeItem('login');
                            this.router.navigate(['/login']);
                        }
                        if (currusername != objusername) {
                            this.getUserList();
                        }
                    });
                },
                    (error) => {
                        alert("Erro ao redefinir senha")
                    });
            }
        });
    }
    getAuditList() {
        this.sloader = 1;
        let dta = this.auditForm.controls["dtinicio"].value;
        let dtb = this.auditForm.controls["dtfim"].value;
        let query = this.auditForm.controls["busca"].value;
        this.service.getLogList(dta, dtb, query).subscribe(a => {
            console.log(a);
            this.auditlogs = a.log;
            console.log(this.auditlogs);
            this.sloader = 0;
        },
            (error) => {
                console.log(error);
                this.sloader = 0;
            });

    }
    searchParamsGerente() {
        let vala;
        let valb;
        let dta = this.buscaEstornoGerenteForm.controls["dtinicio"].value;
        let dtb = this.buscaEstornoGerenteForm.controls["dtfim"].value;
        let cpf;
        let unidade = this.user.unidade;
        let financiador;

        if (this.buscaEstornoGerenteForm.controls["valinicio"].value != '' && this.buscaEstornoGerenteForm.controls["valinicio"].value != 0 && this.buscaEstornoGerenteForm.controls["valinicio"].value != null) {
            vala = this.buscaEstornoGerenteForm.controls["valinicio"].value;
        }
        else {
            vala = null;
        }
        if (this.buscaEstornoGerenteForm.controls["valfim"].value != '' && this.buscaEstornoGerenteForm.controls["valfim"].value != 0 && this.buscaEstornoGerenteForm.controls["valfim"].value != null) {
            valb = this.buscaEstornoGerenteForm.controls["valfim"].value;
        }
        else {
            valb = null;
        }
        if (this.buscaEstornoGerenteForm.controls["cpf"].value != '' && this.buscaEstornoGerenteForm.controls["cpf"].value != null) {
            cpf = this.buscaEstornoGerenteForm.controls["cpf"].value;
        }
        else {
            cpf = null;
        }

        let params = {
            dta: dta,
            dtb: dtb,
            vala: vala,
            valb: valb,
            cpf: cpf,
            unidade: unidade
        }
        return params;
    }
    getWaitEstornosGerente() {
        const obj = this.searchParamsGerente();
        console.log(obj);
        this.sloader = 1;
        this.service.getWaitEstornoVendaList(obj).subscribe(v => {
            console.log(v);
            this.sloader = 0;
            let vendas = v.Vendas;
            // for (let x = 0; x < vendas.length; x++) {
            //   if (vendas[x].financiador != 'BANCO JF') {
            //     vendas[x].valorparcela = vendas[x].valortotal / vendas[x].parcela;
            //   }
            // }
            this.waitestornolistger = vendas;
        },
            (error) => {
                console.log(error);
                this.sloader = 0;
            });
    }
    searchParams() {
        let vala;
        let valb;
        let dta = this.buscaEstornoForm.controls["dtinicio"].value;
        let dtb = this.buscaEstornoForm.controls["dtfim"].value;
        let cpf;
        let unidade;
        let financiador;

        if (this.buscaEstornoForm.controls["valinicio"].value != '' && this.buscaEstornoForm.controls["valinicio"].value != 0 && this.buscaEstornoForm.controls["valinicio"].value != null) {
            vala = this.buscaEstornoForm.controls["valinicio"].value;
        }
        else {
            vala = null;
        }
        if (this.buscaEstornoForm.controls["valfim"].value != '' && this.buscaEstornoForm.controls["valfim"].value != 0 && this.buscaEstornoForm.controls["valfim"].value != null) {
            valb = this.buscaEstornoForm.controls["valfim"].value;
        }
        else {
            valb = null;
        }
        if (this.buscaEstornoForm.controls["cpf"].value != '' && this.buscaEstornoForm.controls["cpf"].value != null) {
            cpf = this.buscaEstornoForm.controls["cpf"].value;
        }
        else {
            cpf = null;
        }
        if (this.buscaEstornoForm.controls["unidade"].value != '' && this.buscaEstornoForm.controls["unidade"].value != null && this.buscaEstornoForm.controls["unidade"].value != "todas") {
            unidade = this.buscaEstornoForm.controls["unidade"].value;
        }
        else {
            unidade = null;
        }

        let params = {
            dta: dta,
            dtb: dtb,
            vala: vala,
            valb: valb,
            cpf: cpf,
            unidade: unidade
        }
        return params;
    }
    getWaitEstornos() {
        const obj = this.searchParams();
        console.log(obj);
        this.sloader = 1;
        this.service.getWaitEstornoVendaList(obj).subscribe(v => {
            console.log(v);
            this.sloader = 0;
            let vendas = v.Vendas;
            // for (let x = 0; x < vendas.length; x++) {
            //   if (vendas[x].financiador != 'BANCO JF') {
            //     vendas[x].valorparcela = vendas[x].valortotal / vendas[x].parcela;
            //   }
            // }
            this.waitestornolist = vendas;
        },
            (error) => {
                console.log(error);
                this.sloader = 0;
            });
    }
    estornaVenda(index: any) {
        console.log(this.user);
        console.log(this.waitestornolist[index]);
        let role = this.role;
        let user = this.user.nome;
        let username = this.user.username;
        let userunidade = this.user.unidade;
        let id = this.waitestornolist[index].id;
        let venda = this.waitestornolist[index];
        const dialogRef = this.dialog.open(ModalconfirmwaitdescontoComponent, {
            data: {
                id: id,
                venda: venda,
                user: user,
                username: username
            },
            panelClass: 'modalestorno'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let response = result.response;
                let obj = result.obj;
                let pwd = result.pwd;
                const usuario = this.auth.getUser();
                this.service.getUser(usuario).subscribe(u => {
                    if (u.pwd == pwd) {
                        if (response == 'aceito') {
                            this.service.adminAceitaEstorno(obj).subscribe(a => {
                                console.log(a);
                                if (a.status == 'ok') {
                                    this.waitestornolist.splice(index, 1);
                                    alert("Venda estornada com sucesso");
                                    this.sloader = 0;
                                }
                                if (a.status == '404') {
                                    // this.waitestornolist.splice(index, 1);
                                    alert("Não foi possivel realizar o estorno desta venda: a solicitação foi cancelada ou o estorno já foi realizado");
                                    this.sloader = 0;
                                }
                                if (a.status == 'error') {
                                    alert("Erro ao estornar venda");
                                    this.sloader = 0;
                                }
                            },
                                (error) => {
                                    console.log(error);
                                    alert("Erro ao confirmar estorno");
                                    this.sloader = 0;
                                });
                        }
                        if (response == 'rejeitado') {
                            this.service.adminRejeitaEstorno(obj).subscribe(a => {
                                console.log(a);
                                if (a.status == 'ok') {
                                    this.waitestornolist.splice(index, 1);
                                    alert("Solicitação de estorno rejeitada sucesso");
                                    this.sloader = 0;
                                }
                                if (a.status == '404') {
                                    // this.waitestornolist.splice(index, 1);
                                    alert("Não foi possivel rejeitar o estorno desta venda: a solicitação foi cancelada ou o estorno já foi realizado");
                                    this.sloader = 0;
                                }

                                if (a.status == 'error') {
                                    alert("Erro ao rejeitar solicitação de estorno");
                                    this.sloader = 0;
                                }
                            },
                                (error) => {
                                    console.log(error);
                                    alert("Erro ao rejeitar solicitação de estorno");
                                    this.sloader = 0;
                                });
                        }
                    }
                    else {
                        this.sloader = 0;
                        alert("Senha incorreta");
                    }
                },
                    (error) => {
                        console.log(error);
                        this.sloader = 0;
                        alert("Erro ao concluir a operação")
                    });
            }
        });
    }
    estornaVendaEx(index: any) {
        console.log(this.user);
        console.log(this.waitestornolist[index]);
        let role = this.role;
        let user = this.user.nome;
        let username = this.user.username;
        let userunidade = this.user.unidade;
        let id = this.waitestornolist[index].id;
        let obj = this.waitestornolist[index];
        const dialogRef = this.dialog.open(ModalconfirmwaitestornoespecialComponent, {
            data: {
                id: id,
                obj: obj,
                user: user,
                username: username
            },
            panelClass: 'modalestorno'
        });
        dialogRef.afterClosed().subscribe(result => {
            console.log(result);
            if (result) {
                this.sloader = 1;
                let obj = result.obj;
                let pwd = result.pwd;
                const usuario = this.auth.getUser();
                this.service.getUser(usuario).subscribe(u => {
                    if (u.pwd == pwd) {
                        this.service.adminUpdateEstornoEx(obj).subscribe(a => {
                            console.log(a);
                            if (a.status == 'ok') {
                                this.waitestornolist.splice(index, 1);
                                if (obj.situacao == 'Estorno parcial' || obj.situacao == 'Estorno total') {
                                    alert("Estorno realizado com sucesso");
                                }
                                if (obj.situacao == 'Rejeitado') {
                                    alert("Estorno rejeitado com sucesso");
                                }
                                this.sloader = 0;
                            }
                            if (a.status == '404') {
                                // this.waitestornolist.splice(index, 1);
                                alert("Não foi possivel realizar o estorno desta venda: a solicitação foi cancelada ou o estorno já foi realizado");
                                this.sloader = 0;
                            }
                            if (a.status == 'error') {
                                if (obj.situacao == 'Estorno parcial' || obj.situacao == 'Estorno total') {
                                    alert("Estorno realizado com sucesso");
                                }
                                if (obj.situacao == 'Rejeitado') {
                                    alert("Estorno rejeitado com sucesso");
                                }
                                this.sloader = 0;
                            }
                        },
                            (error) => {
                                console.log(error);
                                if (obj.situacao == 'Estorno parcial' || obj.situacao == 'Estorno total') {
                                    alert("Estorno realizado com sucesso");
                                }
                                if (obj.situacao == 'Rejeitado') {
                                    alert("Estorno rejeitado com sucesso");
                                }
                                this.sloader = 0;
                            });
                    }
                    else {
                        this.sloader = 0;
                        alert("Senha incorreta");
                    }
                },
                    (error) => {
                        console.log(error);
                        this.sloader = 0;
                        alert("Erro ao concluir a operação")
                    });
            }
        });
    }
    setDadosBancarios() {
        console.log(this.exEstornoForm.controls["tipo"].value);
        this.exEstornoForm.addControl("tipopix", new FormControl('', Validators.required));
        this.exEstornoForm.addControl("chavepix", new FormControl('', Validators.required));
        this.exEstornoForm.addControl("banco", new FormControl('', Validators.required));
        this.exEstornoForm.addControl("agencia", new FormControl('', Validators.required));
        this.exEstornoForm.addControl("conta", new FormControl('', Validators.required));
        this.exEstornoForm.addControl("tipoconta", new FormControl('', Validators.required));
        if (this.exEstornoForm.controls["tipo"].value == "PIX") {
            this.exEstornoForm.removeControl("banco");
            this.exEstornoForm.removeControl("agencia");
            this.exEstornoForm.removeControl("conta");
            this.exEstornoForm.removeControl("tipoconta");
        }
        if (this.exEstornoForm.controls["tipo"].value == "TRANSFERÊNCIA BANCÁRIA") {
            this.exEstornoForm.removeControl("tipopix");
            this.exEstornoForm.removeControl("chavepix");
        }
        if (this.exEstornoForm.controls["tipo"].value == "CRÉDITO NO CARTÃO" || this.exEstornoForm.controls["tipo"].value == "DINHEIRO") {
            this.exEstornoForm.removeControl("banco");
            this.exEstornoForm.removeControl("agencia");
            this.exEstornoForm.removeControl("conta");
            this.exEstornoForm.removeControl("tipoconta");
            this.exEstornoForm.removeControl("tipopix");
            this.exEstornoForm.removeControl("chavepix");
        }
        this.showmotivo = 1;
        console.log(this.exEstornoForm);
    }
    cpfValidExEstornoPix() {
        const cpf = this.exEstornoForm.controls["chavepix"].value;
        // console.log(this.exEstornoForm.controls["cpfcnpj"].value);
        console.log(cpf);
        // validate(cpf);
        if ((cpf.length > 0) && !validate(cpf)) {
            this.exEstornoForm.controls["chavepix"].setValue('');
            this.cpix.nativeElement.focus();
            alert("CPF inválido")

        }
    }
    fixValoresExEstorno() {
        if (this.exEstornoForm.controls["valorcompra"].value < this.exEstornoForm.controls["valorestorno"].value) {
            this.exEstornoForm.controls["valorestorno"].setValue(this.exEstornoForm.controls["valorcompra"].value);
        }
    }
    chooseValidatorBuscaGerente() {
        if (this.buscaEstornoGerenteForm.controls["cpf"].value.length <= 11) {
            this.cpfValidBuscaGerente();
        }
        if (this.buscaEstornoGerenteForm.controls["cpf"].value.length > 11) {
            this.cnpjValidBuscaGerente();
        }
    }
    chooseValidatorBuscaAdmin() {
        if (this.buscaEstornoForm.controls["cpf"].value.length <= 11) {
            this.cpfValidBuscaAdmin();
        }
        if (this.buscaEstornoForm.controls["cpf"].value.length > 11) {
            this.cnpjValidBuscaAdmin();
        }
    }
    chooseValidator() {
        if (this.exEstornoForm.controls["cpfcnpj"].value.length <= 11) {
            this.cpfValidExEstorno();
        }
        if (this.exEstornoForm.controls["cpfcnpj"].value.length > 11) {
            this.cnpjValidExEstorno();
        }
    }
    chooseValidatorPix() {
        if (this.exEstornoForm.controls["cpfcnpj"].value.length <= 11) {
            this.cpfValidExEstorno();
        }
        if (this.exEstornoForm.controls["cpfcnpj"].value.length > 11) {
            this.cnpjValidExEstorno();
        }
    }


    cnpjValidExEstornoPix() {
        const cnpj = this.exEstornoForm.controls["cpfcnpj"].value;
        // console.log(this.exEstornoForm.controls["cpfcnpj"].value);
        console.log(cnpj);
        // validate(cnpj);
        if ((cnpj.length > 0) && !this.tools.validateCNPJ(cnpj)) {
            this.exEstornoForm.controls["chavepix"].setValue('');
            this.cpix.nativeElement.focus();
            alert("CNPJ inválido")

        }
    }
    cnpjValidExEstorno() {
        const cnpj = this.exEstornoForm.controls["cpfcnpj"].value;
        // console.log(this.exEstornoForm.controls["cpfcnpj"].value);
        console.log(cnpj);
        // validate(cnpj);
        if ((cnpj.length > 0) && !this.tools.validateCNPJ(cnpj)) {
            this.exEstornoForm.controls["cpfcnpj"].setValue('');
            this.estcpf.nativeElement.focus();
            alert("CNPJ inválido")

        }
    }
    cpfValidExEstorno() {
        const cpf = this.exEstornoForm.controls["cpfcnpj"].value;
        // console.log(this.exEstornoForm.controls["cpfcnpj"].value);
        console.log(cpf);
        // validate(cpf);
        if ((cpf.length > 0) && !validate(cpf)) {
            this.exEstornoForm.controls["cpfcnpj"].setValue('');
            this.estcpf.nativeElement.focus();
            alert("CPF inválido")

        }
    }

    cnpjValidBuscaGerente() {
        const cnpj = this.buscaEstornoGerenteForm.controls["cpf"].value;
        // console.log(this.buscaEstornoGerenteForm.controls["cpf"].value);
        console.log(cnpj);
        // validate(cnpj);
        if ((cnpj.length > 0) && !this.tools.validateCNPJ(cnpj)) {
            this.buscaEstornoGerenteForm.controls["cpf"].setValue('');
            this.bcpfger.nativeElement.focus();
            alert("CNPJ inválido")

        }
    }

    cpfValidBuscaGerente() {
        const cpf = this.buscaEstornoGerenteForm.controls["cpf"].value;
        // console.log(this.buscaEstornoGerenteForm.controls["cpf"].value);
        console.log(cpf);
        // validate(cpf);
        if ((cpf.length > 0) && !validate(cpf)) {
            this.buscaEstornoGerenteForm.controls["cpf"].setValue('');
            this.bcpfger.nativeElement.focus();
            alert("CPF inválido")

        }
    }

    cnpjValidBuscaAdmin() {
        const cnpj = this.buscaEstornoForm.controls["cpf"].value;
        // console.log(this.buscaEstornoForm.controls["cpf"].value);
        console.log(cnpj);
        // validate(cnpj);
        if ((cnpj.length > 0) && !this.tools.validateCNPJ(cnpj)) {
            this.buscaEstornoForm.controls["cpf"].setValue('');
            this.bcpfadmin.nativeElement.focus();
            alert("CNPJ inválido")

        }
    }

    cpfValidBuscaAdmin() {
        const cpf = this.buscaEstornoForm.controls["cpf"].value;
        // console.log(this.buscaEstornoForm.controls["cpf"].value);
        console.log(cpf);
        // validate(cpf);
        if ((cpf.length > 0) && !validate(cpf)) {
            this.buscaEstornoForm.controls["cpf"].setValue('');
            this.bcpfadmin.nativeElement.focus();
            alert("CPF inválido")

        }
    }


    logVal(val: any) {
        console.log(val);
    }

    exEstornoFixVal(val: any) {
        let value = Number(this.exEstornoForm.controls[val].value);
        if (value <= 0) {
            this.exEstornoForm.controls[val].setValue(0);
        }
    }
    changeChavePix() {
        this.exEstornoForm.controls["chavepix"].setValue('');
        if (this.exEstornoForm.controls["tipopix"].value == 'CPF' && this.exEstornoForm.controls["cpfcnpj"].value.length > 0) {
            if (this.exEstornoForm.controls["cpfcnpj"].value.length == 11) {
                this.exEstornoForm.controls["chavepix"].setValue(this.exEstornoForm.controls["cpfcnpj"].value);
            }
        }
        if (this.exEstornoForm.controls["tipopix"].value == 'CNPJ' && this.exEstornoForm.controls["cpfcnpj"].value.length > 0) {
            if (this.exEstornoForm.controls["cpfcnpj"].value.length == 14) {
                this.exEstornoForm.controls["chavepix"].setValue(this.exEstornoForm.controls["cpfcnpj"].value);
            }
        }
        if (this.exEstornoForm.controls["tipopix"].value == 'EMAIL' && this.exEstornoForm.controls["email"].value.length > 0) {
            this.exEstornoForm.controls["chavepix"].setValue(this.exEstornoForm.controls["email"].value);
        }
        if (this.exEstornoForm.controls["tipopix"].value == 'TELEFONE' && this.exEstornoForm.controls["tel"].value.length > 0) {
            this.exEstornoForm.controls["chavepix"].setValue(this.exEstornoForm.controls["tel"].value);
        }
    }
    buscaBanco() {
        console.log(this.exEstornoForm.controls['buscabanco'].value.length);
        if (this.exEstornoForm.controls["buscabanco"].value.length >= 2) {

            let search = {
                busca: this.exEstornoForm.controls["buscabanco"].value
            }
            this.service.searchBancos(search).subscribe(b => {
                console.log(b);
                if (b.Bancos.length > 0) {
                    this.bancoarray = b.Bancos;
                    console.log(this.bancoarray);
                }
                else {
                    this.bancoarray = [];
                }
            },
                (error) => {
                    this.bancoarray = [];
                });
        }
        if (this.exEstornoForm.controls["buscabanco"].value.length < 3) {
            this.bancoarray = [];
        }
    }
    selectBanco(obj: any, index: any) {
        let banco = obj.nome;
        this.bcod = obj.codigo;
        this.exEstornoForm.controls["banco"].setValue(banco);
        this.exEstornoForm.controls["buscabanco"].setValue('');
        this.bancoarray = [];
    }
    resetBanco() {
        this.bcod = '';
        this.exEstornoForm.controls["banco"].setValue('');
        this.exEstornoForm.controls["agencia"].setValue('');
        this.exEstornoForm.controls["conta"].setValue('');
    }
    resetSolEstornoEx() {
        this.exEstornoForm.controls["nome"].setValue('');
        this.exEstornoForm.controls["cpfcnpj"].setValue('');
        this.exEstornoForm.controls["email"].setValue('');
        this.exEstornoForm.controls["tel"].setValue('');
        this.exEstornoForm.controls["docodc"].setValue('');
        this.exEstornoForm.controls["fpagcompra"].setValue('');
        this.exEstornoForm.controls["valorcompra"].setValue(0);
        this.exEstornoForm.controls["valorestorno"].setValue(0);
        this.exEstornoForm.controls["tipo"].setValue('');
        this.exEstornoForm.controls["motivo"].setValue('');
        if (this.exEstornoForm.controls["tipopix"]) {
            this.exEstornoForm.removeControl("tipopix");
        }
        if (this.exEstornoForm.controls["chavepix"]) {
            this.exEstornoForm.removeControl("chavepix");
        }
        if (this.exEstornoForm.controls["banco"]) {
            this.exEstornoForm.removeControl("banco");
        }
        if (this.exEstornoForm.controls["agencia"]) {
            this.exEstornoForm.removeControl("agencia");
        }
        if (this.exEstornoForm.controls["conta"]) {
            this.exEstornoForm.removeControl("conta");
        }
        if (this.exEstornoForm.controls["tipoconta"]) {
            this.exEstornoForm.removeControl("tipoconta");
        }
        this.bcod = '';
    }
    confirmSolEstornoEx() {
        if (this.exEstornoForm.valid == true && this.exEstornoForm.controls["valorcompra"].value > 0 && this.exEstornoForm.controls["valorestorno"].value > 0) {
            // alert('OK!');
            // console.log(this.exEstornoForm);
            let nome = this.exEstornoForm.controls["nome"].value;
            let cpfcnpj = this.exEstornoForm.controls["cpfcnpj"].value;
            let email = this.exEstornoForm.controls["email"].value;
            let tel = this.exEstornoForm.controls["tel"].value;
            let docodc = this.exEstornoForm.controls["docodc"].value;
            let fpagcompra = this.exEstornoForm.controls["fpagcompra"].value;
            let valorcompra = this.exEstornoForm.controls["valorcompra"].value;
            let valorestorno = this.exEstornoForm.controls["valorestorno"].value;
            let tipo = this.exEstornoForm.controls["tipo"].value;
            let motivo = this.exEstornoForm.controls["motivo"].value;
            let tipopix = '';
            if (this.exEstornoForm.controls["tipopix"]) {
                tipopix = this.exEstornoForm.controls["tipopix"].value;
            }
            let chavepix = '';
            if (this.exEstornoForm.controls["chavepix"]) {
                chavepix = this.exEstornoForm.controls["chavepix"].value;
            }
            let banco = '';
            if (this.exEstornoForm.controls["banco"]) {
                banco = this.exEstornoForm.controls["banco"].value;
            }
            let agencia = '';
            if (this.exEstornoForm.controls["agencia"]) {
                agencia = this.exEstornoForm.controls["agencia"].value;
            }
            let conta = '';
            if (this.exEstornoForm.controls["conta"]) {
                conta = this.exEstornoForm.controls["conta"].value;
            }
            let tipoconta = '';
            if (this.exEstornoForm.controls["tipoconta"]) {
                tipoconta = this.exEstornoForm.controls["tipoconta"].value;
            }
            let codbanco = '';
            let festornotxt = '';
            let dadosbanktxt = '';
            if (this.exEstornoForm.controls["tipo"].value == 'TRANSFERÊNCIA BANCÁRIA') {
                codbanco = this.bcod;
                festornotxt = 'TRANSFERÊNCIA BANCÁRIA';
                dadosbanktxt = " [BANCO: " + codbanco + " - " + banco + " / AGÊNCIA: " + agencia + " / CONTA: " + conta + "]"
            }
            if (this.exEstornoForm.controls["tipo"].value == 'PIX') {
                festornotxt = 'PIX';
                dadosbanktxt = " [TIPO DE CHAVE PIX: " + tipopix + " / CHAVE PIX: " + chavepix + "]";
            }
            if (this.exEstornoForm.controls["tipo"].value == 'CRÉDITO NO CARTÃO') {
                festornotxt = 'CRÉDITO NO CARTÃO';
            }
            if (this.exEstornoForm.controls["tipo"].value == 'DINHEIRO') {
                festornotxt = 'DINHEIRO';
            }
            let addstr = festornotxt + dadosbanktxt;
            let cpfcnpjstr;
            if (cpfcnpj.length == 11) {
                cpfcnpjstr = "CPF";
            }
            if (cpfcnpj.length == 14) {
                cpfcnpjstr = "CNPJ";
            }
            let emailstr = '';
            if (email.length > 0) {
                emailstr = "EMAIL: " + email + " - ";
            }
            let audittxt = "SOLICITAÇÃO DE ESTORNO ESPECIAL DE COMPRA. DOC ODC: " + docodc + ", VALOR: " + formatCurrency(valorcompra, 'pt-BR', 'R$') + " FORMA DE PAGAMENTO DA COMPRA: " + fpagcompra + ". SOLICITANTE: " + nome + " - " + cpfcnpjstr + ": " + cpfcnpj + " - " + emailstr + "TEL: " + tel + ". FORMA DO ESTORNO: " + addstr + ". Motivo: '" + motivo + "'.";
            let auditobj = "Estorno especial";
            let auditoperacao = "Solicitação";
            let obj = {
                nome: nome,
                cpfcnpj: cpfcnpj,
                email: email,
                tel: tel,
                docodc: docodc,
                fpagcompra: fpagcompra,
                valorcompra: valorcompra,
                valorestorno: valorestorno,
                tipo: tipo,
                motivo: motivo,
                tipopix: tipopix,
                chavepix: chavepix,
                banco: banco,
                codbanco: codbanco,
                agencia: agencia,
                conta: conta,
                tipoconta: tipoconta,
                audittxt: audittxt,
                auditobj: auditobj,
                auditoperacao: auditoperacao,
                user: this.user.username,
                unidade: this.user.unidade
            }
            console.log(this.user);
            console.log(obj);
            const dialogRef = this.dialog.open(ModalconfirmwaitestornoexComponent, {
                data: {
                    obj: obj,
                    pwd: this.user.pwd
                },
                panelClass: 'newprodutomodal'
            });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    // console.log(result);
                    this.sloader = 1;
                    const username = this.auth.getUser();

                    this.service.getUser(username).subscribe(u => {
                        let user = u;
                        // console.log(u);
                        // console.log(username);
                        // console.log(user);

                        if (result.pwd == u.pwd) {

                            this.service.newExEstorno(result.obj).subscribe(e => {
                                console.log(e);
                                // let generatedid = e.id;
                                if (e.status == 'ok') {
                                    this.sloader = 0;
                                    this.resetSolEstornoEx();
                                    alert("Estorno solicitado com sucesso");
                                    let printobj = {
                                        nome: result.obj.nome,
                                        cpfcnpj: result.obj.cpfcnpj,
                                        email: result.obj.email,
                                        tel: result.obj.tel,
                                        docodc: result.obj.docodc,
                                        fpagcompra: result.obj.fpagcompra,
                                        valorcompra: result.obj.valorcompra,
                                        valorestorno: result.obj.valorestorno,
                                        tipo: result.obj.tipo,
                                        motivo: result.obj.motivo,
                                        tipopix: result.obj.tipopix,
                                        chavepix: result.obj.chavepix,
                                        banco: result.obj.banco,
                                        codbanco: result.obj.codbanco,
                                        agencia: result.obj.agencia,
                                        conta: result.obj.conta,
                                        tipoconta: result.obj.tipoconta,
                                        audittxt: result.obj.audittxt,
                                        auditobj: result.obj.auditobj,
                                        auditoperacao: result.obj.auditoperacao,
                                        createdby: result.obj.user,
                                        unidade: result.obj.unidade,
                                        createdat: new Date()
                                    }
                                    console.log(printobj);
                                    const dialogRefb = this.dialog.open(ModalprintrequerimentoComponent, {
                                        data: {
                                            obj: printobj,
                                            tipo: 'especial'
                                        },
                                        panelClass: 'modalprintreq'
                                    });
                                }
                                if (e.status == 'error') {
                                    this.sloader = 0;
                                    alert("Erro ao solicitar estorno")
                                }
                            },
                                (error) => {
                                    console.log(error);
                                    this.sloader = 0;
                                    alert("Erro ao solicitar estorno")
                                });
                        }
                        else {
                            this.sloader = 0;
                            alert("Senha incorreta");
                        }
                    },
                        (error) => {
                            console.log(error);
                            this.sloader = 0;
                            alert("Erro ao solicitar estorno")
                        });
                }
            });
        }
        else {
            alert('Preencha todos os campos');
        }
    }
    getExEstornos() {
        // if (this.exEstornoForm.valid == true) {
        this.sloader = 1;
        this.exestornolist = [];
        let dta = this.buscaExEstornoForm.controls["dtinicio"].value;
        let dtb = this.buscaExEstornoForm.controls["dtfim"].value;
        let unidade = this.user.unidade;
        const obj = {
            dta: dta,
            dtb: dtb,
            unidade: unidade
        }
        this.service.getExEstornoB(obj).subscribe(e => {
            this.sloader = 0;
            if (e.stats == 'ok') {
                console.log(e);
                this.exestornolist = e.array;
                this.sloader = 0;
            }
            if (e.stats == 'error') {
                console.log(e);
                this.exestornolist = [];
                this.sloader = 0;
            }
        },
            (error) => {
                console.log(error);
                this.sloader = 0;
                alert('Erro ao buscar estornos');
            });
        // }
    }
    vendaEstornoDetails(index: any) {
        console.log(this.user);
        console.log(this.waitestornolistger[index]);
        let role = this.role;
        let userunidade = this.user.unidade;
        let vendaunidade = this.waitestornolistger[index].unidade;
        let id = this.waitestornolistger[index].id;
        let waitestorno = this.waitestornolistger[index].waitestornostatus;
        let waitestornouser = this.waitestornolistger[index].waitestornouser;
        let waitestornotxt = this.waitestornolistger[index].waitestornotxt;
        let waitestornovalor = this.waitestornolistger[index].waitestornovalor;
        console.log(waitestorno);
        console.log(role);
        console.log(userunidade);
        console.log(vendaunidade);


        let venda = {
            id: this.waitestornolistger[index].id,
            cliente: this.waitestornolistger[index].cliente,
            fiador: this.waitestornolistger[index].fiador,
            cpfpaciente: this.waitestornolistger[index].cpfpaciente,
            cpffiador: this.waitestornolistger[index].cpffiador,
            docfinanceiro: this.waitestornolistger[index].docfinanceiro,
            docodc: this.waitestornolistger[index].docodc,
            parcela: this.waitestornolistger[index].parcela,
            valortotal: this.waitestornolistger[index].valortotal,
            valoratual: this.waitestornolistger[index].valoratual,
            valorestorno: this.waitestornolistger[index].valorestorno,
            isnotfiador: this.waitestornolistger[index].isnotfiador,
            financiador: this.waitestornolistger[index].financiador,
            createdby: this.waitestornolistger[index].createdby,
            createdat: this.waitestornolistger[index].createdat,
            updatedat: this.waitestornolistger[index].updatedat,
            unidade: this.waitestornolistger[index].unidade,
            stats: this.waitestornolistger[index].stats,
            formapagparcela: this.waitestornolistger[index].formapagparcela,
            tipoparcelamento: this.waitestornolistger[index].tipoparcelamento,
            valortabela: this.waitestornolistger[index].valortabela,
            valorparcela: this.waitestornolistger[index].valorparcela,
            valoravaliacao: this.waitestornolistger[index].valoravaliacao,
            valorfinanciado: this.waitestornolistger[index].valorfinanciado,
            valorcomercial: this.waitestornolistger[index].valorcomercial,
            valorentrada: this.waitestornolistger[index].valorentrada,
            desconto: this.waitestornolistger[index].desconto,
            waitestornostatus: this.waitestornolistger[index].waitestornostatus,
            waitestornodate: this.waitestornolistger[index].waitestornodate,
            waitestornovalor: this.waitestornolistger[index].waitestornovalor,
            waitestornofpag: this.waitestornolistger[index].waitestornofpag,
            waitestornotxt: this.waitestornolistger[index].waitestornotxt,
            waitestornouser: this.waitestornolistger[index].waitestornouser,
            entradas: this.waitestornolistger[index].entradas,
            produtos: this.waitestornolistger[index].produtos
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
                            this.waitestornolistger.splice(index, 1);
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
    exEstornoDetails(index: any) {
        let obj = this.waitestornolistger[index];
        const dialogRef = this.dialog.open(ModaldetailsexestornoComponent, {
            data: {
                obj: obj
            },
            panelClass: 'newprodutomodal'
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.sloader = 1;
                const username = this.auth.getUser();

                this.service.getUser(username).subscribe(u => {
                    let user = u;
                    // console.log(u);
                    // console.log(username);
                    // console.log(user);

                    if (result.pwd == u.pwd) {
                        let audittxt = "Cancelamento de solicitação de estorno especial do solicitante " + result.obj.nome + " no valor de " + formatCurrency(result.obj.valorestorno, 'pt-BR', 'R$') + " referente ao DOC ODC " + result.obj.docodc + ".";
                        let auditoperacao = "Cancelamento de Solicitação";
                        let auditobj = "Estorno especial";
                        let user = this.user.username;
                        let id = result.obj.id;
                        let dataobj = {
                            id: id,
                            auditoperacao: auditoperacao,
                            auditobj: auditobj,
                            audittxt: audittxt,
                            user: user
                        }
                        this.service.updateExEstorno(dataobj).subscribe(e => {
                            console.log(e);
                            if (e.stats == 'ok') {
                                this.waitestornolistger.splice(index, 1);
                                this.sloader = 0;
                                alert("Solicitação de venda cancelada com sucesso");

                            }
                            if (e.stats == 'error') {
                                this.sloader = 0;
                                alert("Erro ao cancelar solicitação de estorno")
                            }
                        },
                            (error) => {
                                console.log(error);
                                this.sloader = 0;
                                alert("Erro ao cancelar solicitação de estorno")
                            });
                    }
                    else {
                        this.sloader = 0;
                        alert("Senha incorreta");
                    }
                },
                    (error) => {
                        console.log(error);
                        this.sloader = 0;
                        alert("Erro ao cancelar solicitação de estorno")
                    });
            }
        });
    }
    getEstornos() {
        this.sloader = 1;
        let array: any = [];
        this.estornolist = array;
        let thisday = new Date();
        this.thisday = thisday;
        const obj = this.searchParamsEstornos();
        this.dta = obj.dta;
        this.dtb = obj.dtb;
        this.countestornos = 0;
        this.totalestornos = 0;
        let json = JSON.stringify(obj);
        this.service.getEstornoList(json).subscribe(v => {
            this.sloader = 0;
            console.log(v);
            this.estornolist = v;
            console.log(this.estornolist.length);
            let countestornos = 0;
            let totalestornos: Number = 0;
            for (let i = 0; i < v.length; i++) {
                countestornos++;
                totalestornos = Number(totalestornos) + Number(v[i].valorestorno);
            }
            this.countestornos = countestornos;
            this.totalestornos = totalestornos;
            console.log(this.estornolist);
        });
    }

    printEstornos(): void {
        let printContents, popupWin;
        printContents = document.getElementById('printareaEstornoList')!.innerHTML;
        popupWin = window.open('', '_blank');
        popupWin!.document.open();
        popupWin!.document.write(`
          <html>
            <head>
              <title>Relatório</title>
              <style>
                .no-print {
                  visibility: hidden;
                }
                .table {
                  font-size:12px;
                }
                .pad {
                  padding: 0.25rem !important;
                }
                .lfont{
                  font-size: 8px;
                }
                .pa {
                  font-size:15px;
                  margin-left:2px;
                  position:absolute;
                }
              </style>
              <link rel="stylesheet" href="styles.css">
            </head>
        <body onload="window.print();window.close()">${printContents}
        </body>
          </html>`
        );
        popupWin!.document.close();
    }

    downloadEstornos() {
        let fileName = 'relatório.csv';
        let columnNames = ["id", "gerente", "unidade", "valorcompra", "valorsolicitado", "valorestorno", "docodc", "situacao", "motivo", "solicitante", "cpfcnpj", "responsavel", "createdat"];
        let header = columnNames.join(';');

        let csv = header;
        csv += '\r\n';

        this.estornolist.map((c: { [x: string]: any; }) => {
            csv += [c["id"], c["gerente"], c["unidade"], c["valorcompra"], c["valorsolicitado"], c["valorestorno"], c["docodc"], c["situacao"], c["motivo"], c["solicitante"], c["cpfcnpj"], c["responsavel"], c["createdat"]].join(';');
            csv += '\r\n';
        })

        var blob = new Blob([csv], { type: "data:text/csv;charset=utf-8" });

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
    searchParamsEstornos() {
        let vala;
        let valb;
        let dta = this.buscaRelatorioEstornosForm.controls["dtinicio"].value;
        let dtb = this.buscaRelatorioEstornosForm.controls["dtfim"].value;
        let unidade;

        if (this.buscaRelatorioEstornosForm.controls["valinicio"].value != '' && this.buscaRelatorioEstornosForm.controls["valinicio"].value != 0 && this.buscaRelatorioEstornosForm.controls["valinicio"].value != null) {
            vala = this.buscaRelatorioEstornosForm.controls["valinicio"].value;
        }
        else {
            vala = null;
        }
        if (this.buscaRelatorioEstornosForm.controls["valfim"].value != '' && this.buscaRelatorioEstornosForm.controls["valfim"].value != 0 && this.buscaRelatorioEstornosForm.controls["valfim"].value != null) {
            valb = this.buscaRelatorioEstornosForm.controls["valfim"].value;
        }
        else {
            valb = null;
        }
        if (this.buscaRelatorioEstornosForm.controls["unidade"].value != '' && this.buscaRelatorioEstornosForm.controls["unidade"].value != null && this.buscaRelatorioEstornosForm.controls["unidade"].value != "todas") {
            unidade = this.buscaRelatorioEstornosForm.controls["unidade"].value;
        }
        else {
            unidade = null;
        }
        if (this.role == 'gerente') {
            unidade = this.user.unidade;
        }
        let params = {
            dta: dta,
            dtb: dtb,
            vala: vala,
            valb: valb,
            unidade: unidade
        }
        return params;
    }
}

// ("117","ADVANCED CC LTDA"), ("172","ALBATROSS CCV S.A"), ("188","ATIVA INVESTIMENTOS S.A"), ("280","AVISTA S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO"), ("080","B&T CC LTDA"), ("021","BANESTES S.A. BANCO DO ESTADO DO ESPÍRITO SANTO"), ("250","BCV – BANCO DE CRÉDITO E VAREJO S.A."), ("144","BEXS BANCO DE CÂMBIO S.A."), ("017","BNY MELLON BANCO S.A."), ("126","BR PARTNERS BANCO DE INVESTIMENTO S.A."), ("070","BRB – BANCO DE BRASÍLIA S.A."), ("173","BRL TRUST DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A."), ("292","BS2 DISTRIBUIDORA DE TÍTULOS E VALORES MOBILIÁRIOS S.A."), ("654","BANCO A.J.RENNER S.A."), ("246","BANCO ABC BRASIL S.A."), ("246","BANCO ABC BRASIL S.A."), ("075","BANCO ABN AMRO S.A"), ("121","BANCO AGIBANK S.A."), ("121","BANCO AGIBANK S.A."), ("025","BANCO ALFA S.A."), ("641","BANCO ALVORADA S.A."), ("065","BANCO ANDBANK (BRASIL) S.A."), ("213","BANCO ARBI S.A."), ("096","BANCO B3 S.A."), ("024","BANCO BANDEPE S.A."), ("318","BANCO BMG S.A."), ("752","BANCO BNP PARIBAS BRASIL S.A."), ("107","BANCO BOCOM BBM S.A."), ("218","BANCO BS2 S.A."), ("208","BANCO BTG PACTUAL S.A."), ("063","BANCO BRADESCARD S.A."), ("036","BANCO BRADESCO BBI S.A."), ("122","BANCO BRADESCO BERJ S.A."), ("204","BANCO BRADESCO CARTÕES S.A."), ("394","BANCO BRADESCO FINANCIAMENTOS S.A."), ("237","BANCO BRADESCO S.A."), ("336","BANCO C6 S.A – C6 BANK"), ("473","BANCO CAIXA GERAL – BRASIL S.A."), ("412","BANCO CAPITAL S.A."), ("040","BANCO CARGILL S.A."), ("368","BANCO CARREFOUR"), ("739","BANCO CETELEM S.A."), ("233","BANCO CIFRA S.A."), ("745","BANCO CITIBANK S.A."), ("241","BANCO CLÁSSICO S.A."), ("748","BANCO COOPERATIVO SICREDI S.A."), ("748","BANCO COOPERATIVO SICREDI S.A."), ("756","BANCO COOPERATIVO DO BRASIL S.A. – BANCOOB"), ("222","BANCO CREDIT AGRICOLE BRASIL S.A."), ("505","BANCO CREDIT SUISSE (BRASIL) S.A."), ("069","BANCO CREFISA S.A."), ("266","BANCO CÉDULA S.A."), ("707","BANCO DAYCOVAL S.A."), ("707","BANCO DAYCOVAL S.A."), ("335","BANCO DIGIO S.A"), ("196","BANCO FAIR CORRETORA DE CÂMBIO S.A"), ("265","BANCO FATOR S.A."), ("224","BANCO FIBRA S.A."), ("626","BANCO FICSA S.A."), ("094","BANCO FINAXIS S.A."), ("612","BANCO GUANABARA S.A."), ("012","BANCO INBURSA S.A."), ("604","BANCO INDUSTRIAL DO BRASIL S.A."), ("653","BANCO INDUSVAL S.A."), ("077","BANCO INTER S.A."), ("249","BANCO INVESTCRED UNIBANCO S.A."), ("479","BANCO ITAUBANK S.A"), ("184","BANCO ITAÚ BBA S.A."), ("029","BANCO ITAÚ CONSIGNADO S.A."), ("376","BANCO J. P. MORGAN S.A."), ("074","BANCO J. SAFRA S.A."), ("217","BANCO JOHN DEERE S.A."), ("076","BANCO KDB S.A."), ("757","BANCO KEB HANA DO BRASIL S.A."), ("600","BANCO LUSO BRASILEIRO S.A."), ("456","BANCO MUFG BRASIL S.A."), ("720","BANCO MAXINVEST S.A."), ("389","BANCO MERCANTIL DE INVESTIMENTOS S.A."), ("389","BANCO MERCANTIL DO BRASIL S.A."), ("370","BANCO MIZUHO DO BRASIL S.A."), ("746","BANCO MODAL S.A."), ("066","BANCO MORGAN STANLEY S.A."), ("243","BANCO MÁXIMA S.A."), ("007","BANCO NACIONAL DE DESENVOLVIMENTO ECONÔMICO E SOCIAL – BNDES"), ("111","BANCO OLIVEIRA TRUST DTVM S.A"), ("169","BANCO OLÉ BONSUCESSO CONSIGNADO S.A."), ("212","BANCO ORIGINAL S.A."), ("079","BANCO ORIGINAL DO AGRONEGÓCIO S.A."), ("712","BANCO OURINVEST S.A."), ("623","BANCO PAN S.A."), ("611","BANCO PAULISTA S.A."), ("643","BANCO PINE S.A."), ("658","BANCO PORTO REAL DE INVESTIMENTOS S.A."), ("747","BANCO RABOBANK INTERNATIONAL BRASIL S.A."), ("633","BANCO RENDIMENTO S.A."), ("741","BANCO RIBEIRÃO PRETO S.A."), ("120","BANCO RODOBENS S.A."), ("422","BANCO SAFRA S.A."), ("033","BANCO SANTANDER (BRASIL) S.A."), ("743","BANCO SEMEAR S.A."), ("754","BANCO SISTEMA S.A."), ("630","BANCO SMARTBANK S.A."), ("366","BANCO SOCIÉTÉ GÉNÉRALE BRASIL S.A."), ("637","BANCO SOFISA S.A."), ("464","BANCO SUMITOMO MITSUI BRASILEIRO S.A."), ("082","BANCO TOPÁZIO S.A."), ("018","BANCO TRICURY S.A."), ("634","BANCO TRIÂNGULO S.A."), ("610","BANCO VR S.A."), ("655","BANCO VOTORANTIM S.A."), ("119","BANCO WESTERN UNION DO BRASIL S.A."), ("124","BANCO WOORI BANK DO BRASIL S.A."), ("348","BANCO XP S/A"), ("003","BANCO DA AMAZÔNIA S.A."), ("083","BANCO DA CHINA BRASIL S.A."), ("051","BANCO DE DESENVOLVIMENTO DO ESPÍRITO SANTO S.A."), ("300","BANCO DE LA NACION ARGENTINA"), ("495","BANCO DE LA PROVINCIA DE BUENOS AIRES"), ("494","BANCO DE LA REPUBLICA ORIENTAL DEL URUGUAY"), ("001","BANCO DO BRASIL S.A."), ("047","BANCO DO ESTADO DE SERGIPE S.A."), ("037","BANCO DO ESTADO DO PARÁ S.A."), ("041","BANCO DO ESTADO DO RIO GRANDE DO SUL S.A."), ("004","BANCO DO NORDESTE DO BRASIL S.A."), ("081","BANCOSEGURO S.A."), ("755","BANK OF AMERICA MERRILL LYNCH BANCO MÚLTIPLO S.A."), ("268","BARIGUI COMPANHIA HIPOTECÁRIA"), ("253","BEXS CORRETORA DE CÂMBIO S/A"), ("134","BGC LIQUIDEZ DTVM LTDA"), ("301","BPP INSTITUIÇÃO DE PAGAMENTOS S.A"), ("092","BRICKELL S.A. CRÉDITO, FINANCIAMENTO E INVESTIMENTO"), ("142","BROKER BRASIL CC LTDA"), ("011","C.SUISSE HEDGING-GRIFFO CV S.A (CREDIT SUISSE)"), ("098-1","CREDIALIANÇA COOPERATIVA DE CRÉDITO RURAL"), ("104","CAIXA ECONÔMICA FEDERAL"), ("288","CAROL DISTRIBUIDORA DE TÍTULOS E VALOR MOBILIÁRIOS LTDA"), ("130","CARUANA SCFI"), ("159","CASA CREDITO S.A"), ("016","CCM DESP TRÂNS SC E RS"), ("089","CCR REG MOGIANA"), ("114","CENTRAL COOPERATIVA DE CRÉDITO NO ESTADO DO ESPÍRITO SANTO"), ("114-7","CENTRAL DAS COOPERATIVAS DE ECONOMIA E CRÉDITO MÚTUO DOESTADO DO ESPÍRITO SANTO LTDA."), ("320","CHINA CONSTRUCTION BANK (BRASIL) BANCO MÚLTIPLO S.A."), ("477","CITIBANK N.A."), ("180","CM CAPITAL MARKETS CCTVM LTDA"), ("127","CODEPE CVC S.A"), ("163","COMMERZBANK BRASIL S.A. – BANCO MÚLTIPLO"), ("060","CONFIDENCE CC S.A"), ("085","COOP CENTRAL AILOS"), ("097","COOPERATIVA CENTRAL DE CRÉDITO NOROESTE BRASILEIRO LTDA."), ("085-X","COOPERATIVA CENTRAL DE CRÉDITO URBANO-CECRED"), ("090-2","COOPERATIVA CENTRAL DE ECONOMIA E CRÉDITO MUTUO – SICOOB UNIMAIS"), ("087-6","COOPERATIVA CENTRA
// ("codigo";"banco"