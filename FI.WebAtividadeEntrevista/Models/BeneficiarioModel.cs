using System.ComponentModel.DataAnnotations;
using FI.WebAtividadeEntrevista.Validations;

namespace FI.WebAtividadeEntrevista.Models
{
    public class BeneficiarioModel
    {
        public long Id { get; set; }
        [Required]
        public string Nome { get; set; }

        [Required(ErrorMessage = "O CPF é obrigatório")]
        [CPFValidator(ErrorMessage = "Digite um CPF válido")]
        public string CPF { get; set; }
        public long ClienteId { get; set; }

    }
}