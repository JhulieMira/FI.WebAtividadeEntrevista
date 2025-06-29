// ========================================
// EVENTOS DO MODAL DE BENEFICIÁRIOS
// ========================================

$(document).ready(function() {
    
    $(document).on('submit', '#formCadastroBeneficiario', function (e) {
        e.preventDefault();

        const cpf = $(this).find('#BeneficiarioCPF').val().trim();
        const nome = $(this).find('#BeneficiarioNome').val().trim();

        if (!nome || !cpf) {
            alert("Preencha todos os campos.");
            return;
        }

        if (!validarCPFBeneficiario(cpf)) {
            return;
        }

        if (window.beneficiarioEmEdicao && window.beneficiarioEmEdicao.Id) {
            $.ajax({
                url: '/Beneficiario/AlterarBeneficiario',
                method: "POST",
                data: {
                    Id: window.beneficiarioEmEdicao.Id,
                    Nome: nome,
                    CPF: cpf,
                    ClienteId: window.parent ? window.parent.$('#Id').val() : $('#Id').val()
                },
                success: function(response) {
                    console.log('Beneficiário atualizado com sucesso:', response);
                    
                    window.beneficiarioEmEdicao.Nome = nome;
                    window.beneficiarioEmEdicao.CPF = cpf;
                    
                    window.beneficiarios.push(window.beneficiarioEmEdicao);
                    
                    const clienteId = window.parent ? window.parent.$('#Id').val() : $('#Id').val();
                    if (clienteId) {
                        $.ajax({
                            url: '/Beneficiario/ListarBeneficiariosPorCliente',
                            method: "GET",
                            data: { clienteId: clienteId },
                            success: function(response) {
                                if (response.Result === "OK" && response.Records) {
                                    window.beneficiarios = [];
                                    response.Records.forEach(function(beneficiario) {
                                        window.beneficiarios.push({
                                            Id: beneficiario.Id,
                                            CPF: beneficiario.CPF,
                                            Nome: beneficiario.Nome
                                        });
                                    });
                                    window.renderizarTabelaBeneficiarios();
                                }
                            },
                            error: function() {
                                window.renderizarTabelaBeneficiarios();
                            }
                        });
                    } else {
                        window.renderizarTabelaBeneficiarios();
                    }
                    
                    $('#BeneficiarioNome').val('');
                    $('#BeneficiarioCPF').val('');
                    window.beneficiarioEmEdicao = null;
                    atualizarInterfaceEdicao();
                    $('#BeneficiarioNome').focus();
                },
                error: function(xhr, status, error) {
                    console.log('Erro ao atualizar beneficiário:', xhr.status, error);
                    alert("Erro ao atualizar beneficiário.");
                }
            });
        } else {
            const clienteId = window.parent ? window.parent.$('#Id').val() : $('#Id').val();
            
            if (clienteId) {
                $.ajax({
                    url: '/Beneficiario/VerificarCPF',
                    method: "GET",
                    data: { cpf: cpf, clienteId: clienteId },
                    success: function(response) {
                        if (response.Existe) {
                            alert("Já existe um beneficiário cadastrado com esse CPF para este cliente.");
                            return;
                        }
                        
                        cadastrarBeneficiarioNoBackend(nome, cpf, clienteId);
                    },
                    error: function() {
                        cadastrarBeneficiarioNoBackend(nome, cpf, clienteId);
                    }
                });
            } else {
                window.adicionarBeneficiario(cpf, nome);
                window.renderizarTabelaBeneficiarios();

                $('#BeneficiarioNome').val('');
                $('#BeneficiarioCPF').val('');
                $('#BeneficiarioNome').focus();
            }
        }
    });

    // EVENTOS DOS BOTÕES
    $(document).on('click', '.btn-excluir', function () {
        const index = $(this).data('index');
        const beneficiario = window.beneficiarios[index];
        
        if (beneficiario.Id) {
            excluirBeneficiario(beneficiario.Id).then(function(response) {
                window.beneficiarios.splice(index, 1);
                window.renderizarTabelaBeneficiarios();
            }).fail(function(xhr, status, error) {
                console.log('Erro na exclusão:', xhr.status, error);
                alert("Erro ao excluir beneficiário.");
            });
        } else {
            window.beneficiarios.splice(index, 1);
            window.renderizarTabelaBeneficiarios();
        }
    });

    $(document).on('click', '.btn-editar', function () {
        const index = $(this).data('index');
        const b = window.beneficiarios[index];

        window.beneficiarioEmEdicao = b;

        $('#BeneficiarioCPF').val(b.CPF);
        $('#BeneficiarioNome').val(b.Nome);

        window.beneficiarios.splice(index, 1);
        window.renderizarTabelaBeneficiarios();
        
        atualizarInterfaceEdicao();
        $('#BeneficiarioNome').focus();
    });

    $(document).on('click', '#btnCancelar', function() {
        cancelarEdicao();
    });

    // EVENTOS DE EDIÇÃO INLINE
    $(document).on('click', '.editable-cpf, .editable-nome', function() {
        const $span = $(this);
        const $input = $span.siblings('input');
        const $row = $span.closest('tr');
        
        $span.hide();
        $input.show().focus().select();
        
        $row.addClass('editing');
    });

    $(document).on('blur', '.input-edit-cpf, .input-edit-nome', function() {
        const $input = $(this);
        const $span = $input.siblings('span');
        const $row = $input.closest('tr');
        const index = parseInt($row.data('index'));
        const campo = $input.hasClass('input-edit-cpf') ? 'CPF' : 'Nome';
        const valor = $input.val().trim();
        
        $input.hide();
        $span.show();
        $row.removeClass('editing');
        
        if (valor !== window.beneficiarios[index][campo]) {
            salvarAlteracoesBeneficiario(index, campo, valor);
            $span.text(valor);
        }
    });

    $(document).on('keydown', '.input-edit-cpf, .input-edit-nome', function(e) {
        if (e.key === 'Enter') {
            $(this).blur();
        } else if (e.key === 'Escape') {
            const $input = $(this);
            const $span = $input.siblings('span');
            const $row = $input.closest('tr');
            
            $input.val($span.text());
            $input.hide();
            $span.show();
            $row.removeClass('editing');
        }
    });

    // EVENTOS DE TECLADO
    $(document).on('keydown', '#BeneficiarioCPF, #BeneficiarioNome', function(e) {
        if (e.key === 'Escape' && window.beneficiarioEmEdicao) {
            cancelarEdicao();
        }
    });

    // EVENTOS DE CLIQUE FORA
    $(document).on('click', function(e) {
        if (window.beneficiarioEmEdicao && !$(e.target).closest('#formCadastroBeneficiario').length) {
            cancelarEdicao();
        }
    });

    // EVENTOS DO MODAL
    $(document).on('hidden.bs.modal', '#beneficiariosModal', function() {
        if (window.beneficiarioEmEdicao) {
            cancelarEdicao();
        }
    });

    // INICIALIZAÇÃO
    if (window.beneficiarios.length > 0) {
        window.renderizarTabelaBeneficiarios();
    }
}); 