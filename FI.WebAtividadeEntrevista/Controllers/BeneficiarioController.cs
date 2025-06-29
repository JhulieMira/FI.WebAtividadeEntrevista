using System.Collections.Generic;
using FI.AtividadeEntrevista.BLL;
using FI.AtividadeEntrevista.DML;
using System.Web.Mvc;
using System.Linq;
using System;
using FI.WebAtividadeEntrevista.Models;

namespace FI.WebAtividadeEntrevista.Controllers
{
    public class BeneficiarioController : Controller
    {
        [HttpGet]
        public JsonResult ListarBeneficiariosPorCliente(int clienteId)
        {
            FI.AtividadeEntrevista.BLL.BoBeneficiario bo = new FI.AtividadeEntrevista.BLL.BoBeneficiario();

            List<Beneficiario> beneficiarios = bo.ListarBeneficiariosPorCliente(clienteId);

            return Json(new { Result = "OK", Records = beneficiarios }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult VerificarCPF(string cpf, long clienteId)
        {
            BoBeneficiario bo = new BoBeneficiario();
            
            List<Beneficiario> beneficiarios = bo.ListarBeneficiariosPorCliente(clienteId);
            bool existeParaCliente = beneficiarios.Any(b => b.CPF == cpf);
            
            return Json(new { Existe = existeParaCliente }, JsonRequestBehavior.AllowGet);
        }

        public ActionResult CarregarConteudoBeneficiarios()
        {
            return PartialView("_ConteudoBeneficiarios");
        }

        [HttpPost]  
        public JsonResult Incluir(BeneficiarioModel model)
        {
            BoBeneficiario bo = new BoBeneficiario();

            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();

                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            
            List<Beneficiario> beneficiariosExistentes = bo.ListarBeneficiariosPorCliente(model.ClienteId);
            if (beneficiariosExistentes.Any(b => b.CPF == model.CPF))
            {
                return Json(string.Join(Environment.NewLine, "Já existe um beneficiário cadastrado com esse CPF para este cliente."));
            }
            else
            {

                model.Id = bo.Incluir(new Beneficiario()
                {
                    Nome = model.Nome,
                    CPF = model.CPF,
                    IdCliente = model.ClienteId
                });


                return Json("Cadastro efetuado com sucesso");
            }
        }

        [HttpPost]
        public JsonResult Excluir(long id)
        {
            BoBeneficiario bo = new BoBeneficiario();
            var response = bo.ExcluirBeneficiario(id);
           
            return response ? Json("Beneficiário excluído com sucesso.") : Json("Erro ao excluir beneficiário.");
        }

        [HttpPost]
        public JsonResult AlterarBeneficiario(BeneficiarioModel beneficiarioModel)
        {
            BoBeneficiario bo = new BoBeneficiario();
            if (!this.ModelState.IsValid)
            {
                List<string> erros = (from item in ModelState.Values
                                      from error in item.Errors
                                      select error.ErrorMessage).ToList();
                Response.StatusCode = 400;
                return Json(string.Join(Environment.NewLine, erros));
            }
            var beneficiarios = new List<Beneficiario>();
            beneficiarios.Add(new Beneficiario()
            {
                Id = beneficiarioModel.Id,
                Nome = beneficiarioModel.Nome,
                CPF = beneficiarioModel.CPF,
                IdCliente = beneficiarioModel.ClienteId
            });
            var listaBeneficiariosRetorno = bo.AlterarOuCadastrarBeneficiario(beneficiarios, beneficiarioModel.ClienteId);
            return Json(listaBeneficiariosRetorno);
        }
    }
}