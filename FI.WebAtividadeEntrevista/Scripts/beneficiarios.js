// GERENCIAMENTO DE BENEFICIÁRIOS

if (typeof window.beneficiarios === 'undefined') {
    window.beneficiarios = [];
}

if (typeof window.beneficiarioEmEdicao === 'undefined') {
    window.beneficiarioEmEdicao = null;
}

let validandoCPF = false;

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

    window.beneficiarios.forEach((b, index) => {
        const row = `
            <tr data-index="${index}">
                <td>
                    <span class="editable-cpf" data-field="CPF" data-index="${index}">${b.CPF}</span>
                    <input type="text" class="form-control input-edit-cpf" style="display:none;" value="${b.CPF}" maxlength="14">
                </td>
                <td>
                    <span class="editable-nome" data-field="Nome" data-index="${index}">${b.Nome}</span>
                    <input type="text" class="form-control input-edit-nome" style="display:none;" value="${b.Nome}" maxlength="50">
                </td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm btn-editar" data-index="${index}">Alterar</button>
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
        
        const outroBeneficiario = window.beneficiarios.find((b, i) => i !== indexExcluir && b.CPF === cpf);
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
    }
    
    beneficiario[campo] = valor;
    
    if (beneficiario.Id) {
        $.ajax({
            url: '/Beneficiario/AlterarBeneficiario',
            method: "POST",
            data: {
                Id: beneficiario.Id,
                Nome: beneficiario.Nome,
                CPF: beneficiario.CPF,
                ClienteId: window.parent ? window.parent.$('#Id').val() : $('#Id').val()
            },
            success: function(response) {
            },
            error: function(xhr, status, error) {
                beneficiario[campo] = valorAnterior;
                window.renderizarTabelaBeneficiarios();
                alert("Erro ao alterar beneficiário.");
            }
        });
    }
}


// FUNÇÕES DE INTERFACE
function cancelarEdicao() {
    if (window.beneficiarioEmEdicao) {
        window.beneficiarios.push(window.beneficiarioEmEdicao);
        window.renderizarTabelaBeneficiarios();
        
        $('#BeneficiarioNome').val('');
        $('#BeneficiarioCPF').val('');
        window.beneficiarioEmEdicao = null;
        
        atualizarInterfaceEdicao();
    }
}


function atualizarInterfaceEdicao() {
    if (window.beneficiarioEmEdicao) {
        $('#btnIncluir').text('Atualizar');
        $('#divCancelar').show();
    } else {
        $('#btnIncluir').text('Incluir');
        $('#divCancelar').hide();
    }
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
                                const existeCPF = window.beneficiarios.some(b => b.CPF === beneficiario.CPF);
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