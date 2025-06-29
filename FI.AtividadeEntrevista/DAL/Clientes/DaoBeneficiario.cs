using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using FI.AtividadeEntrevista.DML;

namespace FI.AtividadeEntrevista.DAL.Clientes
{
    internal class DaoBeneficiario : AcessoDados
    {
        internal bool ExcluirBeneficiario(long id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();
            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", id));
            try
            {
                base.Executar("FI_SP_DelBeneficiario", parametros);
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }
        internal Beneficiario AlterarBeneficiario(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();
            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", beneficiario.Id));
            parametros.Add(new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome));
            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF));
            parametros.Add(new System.Data.SqlClient.SqlParameter("IdCliente", beneficiario.IdCliente));
            DataSet ds = base.Consultar("FI_SP_AltBeneficiario", parametros);

            return Converter(ds).FirstOrDefault();
        }

        internal List<Beneficiario> ListarBeneficiariosPorCliente(long id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", id));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiario", parametros);
            List<DML.Beneficiario> cli = Converter(ds);

            return cli;
        }

        public Beneficiario ObterBeneficiarioPorId(long id)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();
            parametros.Add(new System.Data.SqlClient.SqlParameter("Id", id));
            DataSet ds = base.Consultar("FI_SP_ConsBeneficiarioPorId", parametros);
            List<DML.Beneficiario> lista = Converter(ds);
            return lista.FirstOrDefault();
        }

        private List<DML.Beneficiario> Converter(DataSet ds)
        {
            List<DML.Beneficiario> lista = new List<DML.Beneficiario>();
            if (ds != null && ds.Tables != null && ds.Tables.Count > 0 && ds.Tables[0].Rows.Count > 0)
            {
                foreach (DataRow row in ds.Tables[0].Rows)
                {
                    DML.Beneficiario cli = new DML.Beneficiario();
                    cli.Id = row.Field<long>("Id");
                    cli.CPF = row.Field<string>("CPF");
                    cli.Nome = row.Field<string>("Nome");
                    cli.IdCliente = row.Field<long>("IdCliente");
                    lista.Add(cli);
                }
            }

            return lista;
        }

        public long Incluir(DML.Beneficiario beneficiario)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("Nome", beneficiario.Nome));
            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", beneficiario.CPF));
            parametros.Add(new System.Data.SqlClient.SqlParameter("IdCliente", beneficiario.IdCliente));

            DataSet ds = base.Consultar("FI_SP_IncBeneficiario", parametros);
            long ret = 0;
            if (ds.Tables[0].Rows.Count > 0)
                long.TryParse(ds.Tables[0].Rows[0][0].ToString(), out ret);
            return ret;
        }

        public bool VerificarExistencia(string CPF)
        {
            List<System.Data.SqlClient.SqlParameter> parametros = new List<System.Data.SqlClient.SqlParameter>();

            parametros.Add(new System.Data.SqlClient.SqlParameter("CPF", CPF));

            DataSet ds = base.Consultar("FI_SP_ConsBeneficiarioPorCPF", parametros);

            return ds.Tables[0].Rows.Count > 0;
        }
    }
   
}
