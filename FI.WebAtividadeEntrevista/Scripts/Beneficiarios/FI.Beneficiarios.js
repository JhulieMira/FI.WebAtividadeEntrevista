// GERENCIAMENTO DE BENEFICIÁRIOS

if (typeof window.beneficiarios === 'undefined') {
    window.beneficiarios = [];
}

if (typeof window.beneficiarioEmEdicao === 'undefined') {
    window.beneficiarioEmEdicao = null;
}

let validandoCPF = false;

// FUNÇÃO GLOBAL PARA CONFIGURAR MÁSCARAS
window.configurarMascarasBeneficiarios = function() {
    function aplicarMascaraCPF(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d)/, '$1.$2');
            value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
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
    
    var cpfField = document.getElementById('BeneficiarioCPF');
    if (cpfField) {
        if (cpfField.value) {
            cpfField.value = formatarCPF(cpfField.value);
        }
        
        if (cpfField._mascaraHandler) {
            cpfField.removeEventListener('input', cpfField._mascaraHandler);
        }
        
        cpfField._mascaraHandler = function() {
            aplicarMascaraCPF(this);
        };
        
        cpfField.addEventListener('input', cpfField._mascaraHandler);
    }
    
    document.addEventListener('input', function(e) {
        if (e.target.classList.contains('input-edit-cpf')) {
            aplicarMascaraCPF(e.target);
        }
    });
    
    var form = document.getElementById('formCadastroBeneficiario');
    if (form) {
        if (form._submitHandler) {
            form.removeEventListener('submit', form._submitHandler);
        }
        
        form._submitHandler = function() {
            var cpfField = document.getElementById('BeneficiarioCPF');
            if (cpfField) {
                var cpfValue = cpfField.value.replace(/[^\d]/g, '');
                
                var hiddenField = document.createElement('input');
                hiddenField.type = 'hidden';
                hiddenField.name = 'BeneficiarioCPF';
                hiddenField.value = cpfValue;
                form.appendChild(hiddenField);
                
                cpfField.disabled = true;
            }
        };
        
        form.addEventListener('submit', form._submitHandler);
    }
};

// Verificar se a função foi definida corretamente
console.log('Script beneficiarios.js carregado');
console.log('Função configurarMascarasBeneficiarios definida:', typeof window.configurarMascarasBeneficiarios);

// FUNÇÕES GLOBAIS
window.adicionarBeneficiario = function(cpf, nome) {
    window.beneficiarios.push({ CPF: cpf, Nome: nome });
};

// Função para limpar beneficiários em memória (sem ID)
window.limparBeneficiariosEmMemoria = function() {
    window.beneficiarios = window.beneficiarios.filter(b => b.Id);
};

// Função para renderizar tabela de beneficiários
window.renderizarTabelaBeneficiarios = function() {
    const tbody = $('#beneficiariosModal .modal-body table tbody');
    tbody.empty();

    function aplicarMascaraCPF(cpf) {
        if (!cpf) return '';
        const cpfLimpo = cpf.replace(/\D/g, '');
        if (cpfLimpo.length === 11) {
            return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        }
        return cpf;
    }

    window.beneficiarios.forEach((b, index) => {
        const cpfFormatado = aplicarMascaraCPF(b.CPF);
        const row = `
            <tr data-index="${index}">
                <td>
                    <span class="editable-cpf" data-field="CPF" data-index="${index}">${cpfFormatado}</span>
                    <input type="text" class="form-control input-edit-cpf" style="display:none;" value="${cpfFormatado}" maxlength="14">
                </td>
                <td>
                    <span class="editable-nome" data-field="Nome" data-index="${index}">${b.Nome}</span>
                    <input type="text" class="form-control input-edit-nome" style="display:none;" value="${b.Nome}" maxlength="50">
                </td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm btn-editar" data-index="${index}" disabled>Alterar</button>
                    <button type="button" class="btn btn-danger btn-sm btn-excluir" data-index="${index}">Excluir</button>
                </td>
            </tr>
        `;
        tbody.append(row);
    });
};

// FUNÇÕES DE VALIDAÇÃO
function validarCPFBeneficiario(cpf, indexExcluir = -1) {
    if (validandoCPF) return false;
    validandoCPF = true;
    
    try {
        const cpfLimpo = cpf.replace(/\D/g, '');
        
        if (cpfLimpo.length !== 11) {
            alert("CPF deve conter 11 dígitos.");
            return false;
        }
        
        const cpfCliente = window.parent ? window.parent.$('#CPF').val() : $('#CPF').val();
        if (cpfCliente && cpfLimpo === cpfCliente.replace(/\D/g, '')) {
            alert("O CPF do beneficiário não pode ser igual ao CPF do cliente.");
            return false;
        }
        
        const outroBeneficiario = window.beneficiarios.find((b, i) => {
            if (i === indexExcluir) return false;
            const bCpfLimpo = b.CPF.replace(/\D/g, '');
            return bCpfLimpo === cpfLimpo;
        });
        
        if (outroBeneficiario) {
            alert("Já existe um beneficiário com esse CPF na lista atual.");
            return false;
        }
        
        return true;
    } finally {
        validandoCPF = false;
    }
}


// FUNÇÕES DE COMUNICAÇÃO COM SERVIDOR
function excluirBeneficiario(id) {
    return $.ajax({
        url: '/Beneficiario/Excluir',
        method: "POST",
        data: { id: id }
    });
}

function salvarAlteracoesBeneficiario(index, campo, valor) {
    const beneficiario = window.beneficiarios[index];
    const valorAnterior = beneficiario[campo];
    
    if (!valor || valor.trim() === '') {
        alert(`O campo ${campo === 'CPF' ? 'CPF' : 'Nome'} não pode estar vazio.`);
        return;
    }
    
    if (campo === 'CPF') {
        if (!validarCPFBeneficiario(valor, index)) {
            return;
        }
        beneficiario[campo] = valor.replace(/\D/g, '');
    } else {
        beneficiario[campo] = valor.trim();
    }
    
    if (beneficiario.Id) {
        $.ajax({
            url: '/Beneficiario/Alterar',
            method: "POST",
            data: {
                id: beneficiario.Id,
                cpf: campo === 'CPF' ? beneficiario[campo] : beneficiario.CPF,
                nome: campo === 'Nome' ? beneficiario[campo] : beneficiario.Nome
            },
            error: function(r) {
                beneficiario[campo] = valorAnterior;
                alert("Erro ao salvar alterações.");
            },
            success: function(r) {
                window.renderizarTabelaBeneficiarios();
            }
        });
    } else {
        window.renderizarTabelaBeneficiarios();
    }
}


// FUNÇÕES DE INTERFACE
function cancelarEdicao() {
    if (window.beneficiarioEmEdicao !== null) {
        const row = $(`tr[data-index="${window.beneficiarioEmEdicao}"]`);
        const span = row.find(`.editable-${window.campoEmEdicao}`);
        const input = row.find(`.input-edit-${window.campoEmEdicao}`);
        
        input.hide();
        span.show();
        
        window.beneficiarioEmEdicao = null;
        window.campoEmEdicao = null;
        
        atualizarInterfaceEdicao();
    }
}

// Função para verificar mudanças nos campos inline e habilitar/desabilitar botão Alterar
function verificarMudancasInline(index) {
    const row = $(`tr[data-index="${index}"]`);
    const cpfSpan = row.find('.editable-cpf');
    const cpfInput = row.find('.input-edit-cpf');
    const nomeSpan = row.find('.editable-nome');
    const nomeInput = row.find('.input-edit-nome');
    
    const cpfMudou = cpfSpan.text() !== cpfInput.val();
    const nomeMudou = nomeSpan.text() !== nomeInput.val();
    
    const btnEditar = row.find('.btn-editar');
    btnEditar.prop('disabled', !(cpfMudou || nomeMudou));
}

function atualizarInterfaceEdicao() {
    $('.btn-editar').each(function() {
        const index = $(this).data('index');
        verificarMudancasInline(index);
    });
}

window.verificarCPFExistente = function(cpf, clienteId) {
    return $.ajax({
        url: '/Beneficiario/VerificarCPF',
        method: "GET",
        data: { cpf: cpf, clienteId: clienteId }
    });
};

window.limparBeneficiariosEmMemoria = function() {
    window.beneficiarios = window.beneficiarios.filter(b => b.Id);
};

window.cadastrarBeneficiarioNoBackend = function(nome, cpf, clienteId) {
    $.ajax({
        url: '/Beneficiario/Incluir',
        method: "POST",
        data: {
            Nome: nome,
            CPF: cpf,
            ClienteId: clienteId
        },
        success: function(response) {
            console.log('Beneficiário cadastrado com sucesso:', response);
            
            if (typeof response === 'string' && response.includes('sucesso')) {
                alert("Beneficiário cadastrado com sucesso!");
                
                $.ajax({
                    url: '/Beneficiario/ListarBeneficiariosPorCliente',
                    method: "GET",
                    data: { clienteId: clienteId },
                    success: function(response) {
                        if (response.Result === "OK" && response.Records) {
                            const beneficiariosEmMemoria = window.beneficiarios.filter(b => !b.Id);
                            
                            window.beneficiarios = [];
                            response.Records.forEach(function(beneficiario) {
                                window.beneficiarios.push({
                                    Id: beneficiario.Id,
                                    CPF: beneficiario.CPF,
                                    Nome: beneficiario.Nome
                                });
                            });
                            
                            beneficiariosEmMemoria.forEach(function(beneficiario) {
                                const existeCPF = window.beneficiarios.some(b => {
                                    const bCpfLimpo = b.CPF.replace(/\D/g, '');
                                    const beneficiarioCpfLimpo = beneficiario.CPF.replace(/\D/g, '');
                                    return bCpfLimpo === beneficiarioCpfLimpo;
                                });
                                if (!existeCPF) {
                                    window.beneficiarios.push(beneficiario);
                                }
                            });
                            
                            window.renderizarTabelaBeneficiarios();
                        }
                    },
                    error: function() {
                        console.log('Erro ao recarregar beneficiários');
                        window.adicionarBeneficiario(cpf, nome);
                        window.renderizarTabelaBeneficiarios();
                    }
                });
                
                $('#BeneficiarioNome').val('');
                $('#BeneficiarioCPF').val('');
                $('#BeneficiarioNome').focus();
            } else {
                alert("Erro ao cadastrar beneficiário: " + response);
            }
        },
        error: function(xhr, status, error) {
            
            let errorMessage = "Erro ao cadastrar beneficiário.";
            try {
                const response = xhr.responseText;
                if (response) {
                    errorMessage = response;
                }
            } catch (e) {
            }
            
            alert(errorMessage);
        }
    });
}; 