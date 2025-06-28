using System.Collections.Generic;

namespace FI.AtividadeEntrevista.BLL
{
    public class BoBeneficiario
    {
        public List<DML.Beneficiario> ListarBeneficiariosPorCliente(int clienteId)
        {
            FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario cli = new FI.AtividadeEntrevista.DAL.Clientes.DaoBeneficiario();
            return cli.ListarBeneficiariosPorCliente(clienteId);
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
    }
}
