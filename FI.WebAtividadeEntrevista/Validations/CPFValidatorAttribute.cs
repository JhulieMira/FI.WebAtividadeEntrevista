using System.ComponentModel.DataAnnotations;
using System.Linq;

namespace FI.WebAtividadeEntrevista.Validations
{
    public class CPFValidatorAttribute : ValidationAttribute
    {
        public override bool IsValid(object value)
        {
             var cpf = value as string;

            if (string.IsNullOrWhiteSpace(cpf))
                return false;   

            cpf = cpf.Replace(".", "").Replace("-", "").Trim();

            if (cpf.Length != 11 || cpf.All(c => c == cpf[0]))
                return false;

            var multiplicador1 = new int[9] { 10, 9, 8, 7, 6, 5, 4, 3, 2 };
            var multiplicador2 = new int[10] { 11, 10, 9, 8, 7, 6, 5, 4, 3, 2 };

            string tempCpf = cpf.Substring(0, 9);
            int soma = 0;

            for (int i = 0; i < 9; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador1[i];

            int resto = soma % 11;
            int digito1 = (resto < 2) ? 0 : 11 - resto;

            tempCpf += digito1;
            soma = 0;

            for (int i = 0; i < 10; i++)
                soma += int.Parse(tempCpf[i].ToString()) * multiplicador2[i];

            resto = soma % 11;
            int digito2 = (resto < 2) ? 0 : 11 - resto;

            return cpf.EndsWith($"{digito1}{digito2}");
        }
    }

}