// ========================================
// EVENTOS DO FORMULÁRIO PRINCIPAL
// ========================================

$(document).ready(function() {
    // EVENTOS DO MODAL DE BENEFICIÁRIOS
    $('#beneficiariosModal').on('show.bs.modal', function () {
        $('#conteudoBeneficiarios').load('/Beneficiario/CarregarConteudoBeneficiarios', function() {
            console.log('Partial view de beneficiários carregada');
            console.log('Função configurarMascarasBeneficiarios existe:', typeof window.configurarMascarasBeneficiarios);
            
            // Configurar máscaras após o carregamento
            setTimeout(function() {
                console.log('Tentando configurar máscaras...');
                if (typeof window.configurarMascarasBeneficiarios === 'function') {
                    console.log('Chamando configurarMascarasBeneficiarios...');
                    window.configurarMascarasBeneficiarios();
                } else {
                    console.error('Função configurarMascarasBeneficiarios não encontrada!');
                }
            }, 100);
            
            const clienteId = $('#Id').val();
            if (clienteId) {
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
                        setTimeout(function() {
                            if (window.beneficiarios.length > 0) {
                                window.renderizarTabelaBeneficiarios();
                            }
                        }, 100);
                    }
                });
            } else {
                setTimeout(function() {
                    if (window.beneficiarios.length > 0) {
                        window.renderizarTabelaBeneficiarios();
                    }
                }, 100);
            }
        });
    });

    // EVENTOS DO FORMULÁRIO PRINCIPAL
    $('#formCadastro').on('submit', function () {
        $('#BeneficiariosJson').val(JSON.stringify(window.beneficiarios));
    });

    // DETECÇÃO DE SUCESSO NO SALVAMENTO
    $(document).ajaxSuccess(function(event, xhr, settings) {
        if (settings.url && (settings.url.includes('/Cliente/Incluir') || settings.url.includes('/Cliente/Alterar'))) {
            try {
                const response = JSON.parse(xhr.responseText);
                if (typeof response === 'string' && response.includes('sucesso')) {
                    window.limparBeneficiariosEmMemoria();
                }
            } catch (e) {
                window.limparBeneficiariosEmMemoria();
            }
        }
    });

    $(document).on('clienteSalvoComSucesso', function() {
        window.limparBeneficiariosEmMemoria();
    });
}); 