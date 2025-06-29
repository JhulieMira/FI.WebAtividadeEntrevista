$(document).ready(function () {
    if (typeof window.beneficiarios === 'undefined') {
        window.beneficiarios = [];
    }

    function configurarMascaras() {
        function aplicarMascaraCPF(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            }
            input.value = value;
        }
        
        function aplicarMascaraCEP(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length <= 8) {
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            input.value = value;
        }
        
        function aplicarMascaraTelefone(input) {
            let value = input.value.replace(/\D/g, '');
            if (value.length <= 11) {
                value = value.replace(/(\d{2})(\d)/, '($1) $2');
                if (value.length > 10) {
                    value = value.replace(/(\d{5})(\d)/, '$1-$2');
                }
            }
            input.value = value;
        }
        
        function formatarCPF(valor) {
            if (!valor) return '';
            let value = valor.replace(/\D/g, '');
            if (value.length === 11) {
                return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
            }
            return valor;
        }
        
        function formatarCEP(valor) {
            if (!valor) return '';
            let value = valor.replace(/\D/g, '');
            if (value.length === 8) {
                return value.replace(/(\d{5})(\d{3})/, '$1-$2');
            }
            return valor;
        }
        
        function formatarTelefone(valor) {
            if (!valor) return '';
            let value = valor.replace(/\D/g, '');
            if (value.length === 11) {
                return value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
            } else if (value.length === 10) {
                return value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
            }
            return valor;
        }
        
        var cpfField = document.getElementById('CPF');
        if (cpfField) {
            if (cpfField.value) {
                cpfField.value = formatarCPF(cpfField.value);
            }
            
            cpfField.addEventListener('input', function() {
                aplicarMascaraCPF(this);
            });
        }
        
        var cepField = document.getElementById('CEP');
        if (cepField) {
            if (cepField.value) {
                cepField.value = formatarCEP(cepField.value);
            }
            
            cepField.addEventListener('input', function() {
                aplicarMascaraCEP(this);
            });
        }
        
        var telefoneField = document.getElementById('Telefone');
        if (telefoneField) {
            if (telefoneField.value) {
                telefoneField.value = formatarTelefone(telefoneField.value);
            }
            
            telefoneField.addEventListener('input', function() {
                aplicarMascaraTelefone(this);
            });
        }
    }
    
    configurarMascaras();

    if (obj) {
        $('#formCadastro #Id').val(obj.Id);
        $('#formCadastro #Nome').val(obj.Nome);
        $('#formCadastro #CEP').val(obj.CEP);
        $('#formCadastro #Email').val(obj.Email);
        $('#formCadastro #Sobrenome').val(obj.Sobrenome);
        $('#formCadastro #CPF').val(obj.CPF);
        $('#formCadastro #Nacionalidade').val(obj.Nacionalidade);
        $('#formCadastro #Estado').val(obj.Estado);
        $('#formCadastro #Cidade').val(obj.Cidade);
        $('#formCadastro #Logradouro').val(obj.Logradouro);
        $('#formCadastro #Telefone').val(obj.Telefone);
        $('#formCadastro #BeneficiariosJson').val(JSON.stringify(window.beneficiarios));
        
        setTimeout(function() {
            var cpfField = document.getElementById('CPF');
            if (cpfField && cpfField.value) {
                var cpfValue = cpfField.value.replace(/\D/g, '');
                if (cpfValue.length === 11) {
                    cpfField.value = cpfValue.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
                }
            }
            
            var cepField = document.getElementById('CEP');
            if (cepField && cepField.value) {
                var cepValue = cepField.value.replace(/\D/g, '');
                if (cepValue.length === 8) {
                    cepField.value = cepValue.replace(/(\d{5})(\d{3})/, '$1-$2');
                }
            }
            
            var telefoneField = document.getElementById('Telefone');
            if (telefoneField && telefoneField.value) {
                var telefoneValue = telefoneField.value.replace(/\D/g, '');
                if (telefoneValue.length === 11) {
                    telefoneField.value = telefoneValue.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
                } else if (telefoneValue.length === 10) {
                    telefoneField.value = telefoneValue.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
                }
            }
        }, 100);
    }

    $('#formCadastro').submit(function (e) {
        e.preventDefault();
        
        var cpfValue = $('#CPF').val().replace(/[^\d]/g, '');
        var cepValue = $('#CEP').val().replace(/[^\d]/g, '');
        var telefoneValue = $('#Telefone').val().replace(/[^\d]/g, '');
        
        $('#BeneficiariosJson').val(JSON.stringify(window.beneficiarios));
        
        $.ajax({
            url: urlPost,
            method: "POST",
            data: {
                "Id": $(this).find("#Id").val(),
                "Nome": $(this).find("#Nome").val(),
                "CEP": cepValue,
                "Email": $(this).find("#Email").val(),
                "Sobrenome": $(this).find("#Sobrenome").val(),
                "CPF": cpfValue,
                "Nacionalidade": $(this).find("#Nacionalidade").val(),
                "Estado": $(this).find("#Estado").val(),
                "Cidade": $(this).find("#Cidade").val(),
                "Logradouro": $(this).find("#Logradouro").val(),
                "Telefone": telefoneValue,
                "BeneficiariosJson": $(this).find("#BeneficiariosJson").val()
            },
            error: function (r) {
                if (r.status == 400)
                    ModalDialog("Ocorreu um erro", r.responseJSON);
                else if (r.status == 500)
                    ModalDialog("Ocorreu um erro", "Ocorreu um erro interno no servidor.");
            },
            success: function (r) {
                ModalDialog("Sucesso!", r)
                $("#formCadastro")[0].reset();                                
                window.location.href = urlRetorno;
            }
        });
    })
})
