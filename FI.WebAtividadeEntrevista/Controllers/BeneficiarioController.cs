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
            if (bo.VerificarExistencia(model.CPF))
            {
                return Json(string.Join(Environment.NewLine, "Já existe um usuário cadastrado com esse CPF."));
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
    }
}