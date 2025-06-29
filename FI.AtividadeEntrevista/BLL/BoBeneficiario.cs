using System;
using System.Collections.Generic;
using FI.AtividadeEntrevista.DML;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        public List<DML.Beneficiario> ListarBeneficiariosPorCliente(long clienteId)
        {
            FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario cli = new FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario();
            return cli.ListarBeneficiariosPorCliente(clienteId);
        }

        public bool ExcluirBeneficiario(long id)
        {
            FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario cli = new FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario();
          
            var benef = cli.ObterBeneficiarioPorId(id);

            if (benef == null)
                return false;
            else
                return cli.ExcluirBeneficiario(id);
        }

        public bool VerificarExistencia(string CPF)
        {
            FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario cli = new FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario();
            return cli.VerificarExistencia(CPF);
        }

        public long Incluir(DML.Beneficiario beneficiario)
        {
            FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario cli = new FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario();
            return cli.Incluir(beneficiario);
        }

        public List<DML.Beneficiario> AlterarOuCadastrarBeneficiario(List<DML.Beneficiario> beneficiarios, long clienteId)
        {
            FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario cli = new FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario();

            List<DML.Beneficiario> listaBeneficiariosRetorno = new List<DML.Beneficiario>();
            foreach (var beneficiario in beneficiarios)
            {
                if (BeneficiarioJaExistente(beneficiario))
                {
                    cli.AlterarBeneficiario(beneficiario);
                }
                else
                {
                    this.Incluir(beneficiario);
                }
            }
            return cli.ListarBeneficiariosPorCliente(clienteId);
        }

        private bool BeneficiarioJaExistente(Beneficiario beneficiario)
        {
            FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario cli = new FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario();
            if (beneficiario.Id > 0)
            {
                var benef = cli.ObterBeneficiarioPorId((int)beneficiario.Id);
                if (benef.IdCliente == beneficiario.IdCliente)
                    return true; 
            }
            return false;
        }
    }
}
