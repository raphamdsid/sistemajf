import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})

export class ConsultaService {
  buscacpf: String = '';
  online = 'https://sistema.grupojf.com.br';
  offline = 'http://192.168.1.200';
  hamachi = 'http://25.46.48.46'
  url = this.hamachi;
  unilist: any = [];
  constructor(
    private http: HttpClient

  ) { }
  getUrlPartmed() {
    let online = 'http://essencial.partmednovaiguacu.com.br/#/login/:';
    let offline = 'http://192.168.1.200:62571/#/login/:';
    return online;
  }
  uniList() {
    let array: any = [];
    this.http.get("assets/vendor/unidades.json").subscribe(data => {
      let result: any = [];
      array = data;
      for (let x = 0; x < array.length; x++) {
        if (array[x].ativo == 1) {
          result.push(array[x]);
        }
      }
      this.unilist = result;
    });
  }
  getUnid(): Observable<any> {
    return this.unilist;
  }
  getTokenUser() {
    let token: any = sessionStorage.getItem('token');
    let jwt = JSON.parse(JSON.stringify(jwt_decode(token)));
    let user = jwt.username;
    return user;
  }
  getCliente(): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/cliente_read.php`);
  }

  getClienteId(id: string): Observable<any> {

    return this.http.get(this.url + `/jfapi/api/cliente_single_read_id.php/?id=` + id);
  }
  getClienteCpf(cpf: string): Observable<any> {

    return this.http.get(this.url + `/jfapi/api/cliente_single_read.php/?cpf=` + cpf);
  }
  getClienteNome(nome: string): Observable<any> {

    return this.http.get(this.url + `/jfapi/api/cliente_multi_read.php/?nome=` + nome);
  }
  postClienteEdit(cliente: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/cliente_update.php`, cliente);
  }
  postClienteCreate(cliente: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/cliente_create.php`, cliente);
  }
  postClienteDel(cliente: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/cliente_del.php`, cliente);
  }

  getVendedor(): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/vendedor_read.php`);
  }
  getVendedorCpf(cpf: string): Observable<any> {

    return this.http.get(this.url + `/jfapi/api/vendedor_single_read.php/?cpf=` + cpf);
  }
  getVendedorId(id: string): Observable<any> {

    return this.http.get(this.url + `/jfapi/api/vendedor_singleid_read.php/?id=` + id);
  }

  postNewComunicado(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/comunicado_new.php`, obj);
  }
  postDelComunicado(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/comunicado_del.php`, obj);
  }
  postViewlogComunicado(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/comunicado_viewlog.php`, obj);
  }
  getViewlogComunicado(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/comunicado_viewlog_get.php`, obj);
  }
  getContasReceber(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/contas_a_receber.php`, obj);
  }
  getProdDocs(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/produto_doc.php`, obj);
  }
  getManutInad(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/manut_inad.php`, obj);
  }
  getCrcDebitosPaciente(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/crc_debitos_paciente.php`, obj);
  }
  getNewestComunicado(): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/comunicado_get_newest.php`);
  }

  getVendedorNome(nome: string): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/vendedor_multi_read.php/?nome=` + nome);
  }
  postVendedorEdit(vendedor: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/vendedor_update.php`, vendedor);
  }
  postVendedorCreate(vendedor: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/vendedor_create.php`, vendedor);
  }
  postVendedorDel(vendedor: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/vendedor_del.php`, vendedor);
  }
  getDependente(): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/dependente_read.php`);
  }
  getDependenteNome(nome: string): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/dependente_multi_read.php/?nome=` + nome);
  }
  getDependenteList(id: string): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/dependente_list_read.php/?id=` + id);
  }
  postDependenteEdit(dependente: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/dependente_update.php`, dependente);
  }
  postDependenteCreate(dependente: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/dependente_create.php`, dependente);
  }
  postDependenteDel(dependente: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/dependente_del.php`, dependente);
  }
  postDependenteDelete(dependente: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/dependente_delete.php`, dependente);
  }
  postEstornaVenda(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/venda_estorno.php`, obj);
  }
  waitForEstorno(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/venda_estorno_wait.php`, obj);
  }
  postCancelaEstorno(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/venda_cancel_estorno.php`, obj);
  }
  editVenda(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/venda_edit.php`, obj);
  }
  getVenda(): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/venda_read.php`);
  }
  getVendaSingle(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/venda_single_read.php`, obj);
  }
  getVendaSingleActive(id: any): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/venda_single_read_active.php/?id=` + id);
  }
  getVendaNome(nome: string): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/venda_multi_read.php/?nome=` + nome);
  }
  // getVendaList(id: string): Observable<any> {
  //   return this.http.get(this.url+`/jfapi/api/venda_list_read.php/?id=` + id);
  // }
  postVendaEdit(venda: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/venda_update.php`, venda);
  }
  postVendaCreate(venda: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/venda_create.php`, venda);
  }
  postOrdemDeServicoCreate(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/ordemservico_create.php`, obj);
  }
  postOrdemDeServicoProdUpdt(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/ordemservico_produto_update.php`, obj);
  }
  postOrdemDeServicoReadM(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/ordemservico_read.php`, obj);
  }
  postOrdemDeServicoReadS(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/ordemservico_read_single.php`, obj);
  }
  postVendaJfCreate(venda: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/vendajf_create.php`, venda);
  }
  postVendaDel(venda: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/venda_del.php`, venda);
  }
  postVendaDelete(venda: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/venda_delete.php`, venda);
  }
  getVendaList(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/venda_read.php`, obj);
  }
  getWaitEstornoVendaList(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/venda_read_waitestorno.php`, obj);
  }
  getTaxas(): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/config_get_taxas.php`);
  }
  updateTaxas(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_update_taxas.php`, obj);
  }
  newProduto(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_new_produto.php`, obj);
  }
  adminAceitaEstorno(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/admin_estorno_aceito.php`, obj);
  }
  adminRejeitaEstorno(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/admin_estorno_rejeitado.php`, obj);
  }
  adminUpdateEstornoEx(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/admin_exestorno_update.php`, obj);
  }
  getEstornoList(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/admin_estorno_list.php`, obj);
  }
  editProduto(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_edit_produto.php`, obj);
  }
  delProduto(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_del_produto.php`, obj);
  }
  getProduto(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_get_produto.php`, obj);
  }
  searchProdutos(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/produtos_search.php`, obj);
  }
  searchProdutosOs(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/produtos_os_search.php`, obj);
  }
  searchProdutosOsB(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/produtos_os_search_b.php`, obj);
  }
  searchProdutosOsProtocolo(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/produtos_os_search_prot.php`, obj);
  }
  searchBancos(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/bancos_search.php`, obj);
  }
  getProdutosByUnidade(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/produtos_by_unidade.php`, obj);
  }
  getFinanciadores(): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/config_get_financiadores.php/`);
  }
  getEntradas(): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/config_get_entradas.php/`);
  }
  getBancos(): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/config_get_bancos.php/`);
  }
  getLaboratorios(): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/config_get_laboratorios.php/`);
  }
  getProdOs(): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/config_get_produtosordemservico.php/`);
  }
  newFinanciadores(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_new_financiadores.php`, obj);
  }
  newLaboratorios(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_new_laboratorios.php`, obj);
  }
  newProdOs(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_new_produtosordemservico.php`, obj);
  }
  delFinanciadores(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_del_financiadores.php`, obj);
  }
  delLaboratorios(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_del_laboratorios.php`, obj);
  }
  delProdOs(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_del_produtosordemservico.php`, obj);
  }
  newEntradas(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_new_entradas.php`, obj);
  }
  delEntradas(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_del_entradas.php`, obj);
  }
  newBancos(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_new_bancos.php`, obj);
  }
  newExEstorno(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_new_exestorno.php`, obj);
  }
  updateExEstorno(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_upd_exestorno.php`, obj);
  }
  getExEstornoB(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_get_exestorno.php`, obj);
  }
  delBancos(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/config_del_bancos.php`, obj);
  }
  getVendaListByVendedor(dta: Date, dtb: Date, vend: string): Observable<any> {

    return this.http.get(this.url + `/jfapi/api/venda_list_vendedor_read.php/?vend=` + vend + `&data1=` + dta + `&data2=` + dtb);
  }
  getVendaListByPlano(dta: Date, dtb: Date, nome_plano: string): Observable<any> {

    return this.http.get(this.url + `/jfapi/api/venda_list_plano_read.php/?nome_plano=` + nome_plano + `&data1=` + dta + `&data2=` + dtb);
  }
  getVendaListAtrasos(dta: any, dtb: any): Observable<any> {
    let today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    return this.http.get(this.url + `/jfapi/api/venda_atrasada_list_read.php/?data=` + today + `&data1=` + dta + `&data2=` + dtb);
  }

  getVendaListCaixaDiario(dta: Date, dtb: Date): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/venda_list_caixa_read.php/?data1=` + dta + `&data2=` + dtb);
  }
  getVendaListCaixaDiarioSimple(dta: Date, dtb: Date): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/venda_list_caixa_read_simple.php/?data1=` + dta + `&data2=` + dtb);
  }
  getVendaListContasReceber(dta: Date, dtb: Date): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/venda_list_areceber_read.php/?data1=` + dta + `&data2=` + dtb);
  }
  getContaListAtrasosByContrato(array: any): Observable<any> {
    let today = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    return this.http.post(this.url + `/jfapi/api/venda_atrasada_list_read_contrato.php/`, array);
  }
  postPagamentoCreate(venda: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/pagamento_create.php`, venda);
  }
  postMassPagamentoCreate(venda: string): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/pagamento_create_mass.php`, venda);
  }
  postFormaPagamentoCreate(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/pagamento_forma_create.php`, obj);
  }
  postEstornaPagamento(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/pagamento_estorno.php`, obj);
  }
  getPagamento(venda_id: any): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/pagamento_list_read.php/?venda_id=` + venda_id);
  }
  postPagamentoUpdate(objpagamento: any): Observable<any> {
    let user = this.getTokenUser();
    objpagamento.usuario = user;
    return this.http.post(this.url + `/jfapi/api/pagamento_update.php`, objpagamento);
  }
  getUser(user: any): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/user_read.php/?user=` + user);
  }
  checkUser(user: any): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/user_check.php/?user=` + user);
  }

  createToken(user: any, pass: any): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/create_token.php/?user=` + user + `&pass=` + pass);
  }
  createTokenUnidade(unidade: any): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/create_token_unidade.php`, unidade);
  }

  authToken(token: any): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/auth_token.php/?token=` + token);
  }
  login(user: any, pass: any): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/login.php/?user=` + user + `&pass=` + pass);
  }
  createUser(user: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/user_create.php`, user);
  }
  updateUser(user: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/user_update.php`, user);
  }
  updateUserUnidade(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/user_update_unidade.php`, obj);
  }
  getUserList(user: any, query: any): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/user_list.php/?user=` + user + `&query=` + query);
  }
  getUserListUnidade(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/user_list_unidade.php/`, obj);
  }
  getLogList(dta: any, dtb: any, query: any): Observable<any> {
    return this.http.get(this.url + `/jfapi/api/audit_list.php/?data1=` + dta + `&data2=` + dtb + `&query=` + query);
  }
  createLog(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/api/audit_log_create.php`, obj);
  }
  processaPagamentoMP(obj: any): Observable<any> {
    return this.http.post(this.url + `/jfapi/teste_mp/process_paymentb.php`, obj);
  }

  createLogObj(logobj: any) {
    let user = this.getTokenUser();
    console.log(user);
    let objt = {
      usuario: user,
      objeto: logobj.objeto,
      operacao: logobj.operacao,
      descricao: logobj.descricao
    }
    let obj = JSON.stringify(JSON.parse)
    return this.createLog(objt);
  }
}

// [192.168.1.200]
// [sistema.grupojf.com.br]
