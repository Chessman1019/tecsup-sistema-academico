package pe.edu.tecsup.sistemaacademico.service;

import pe.edu.tecsup.sistemaacademico.dto.request.CertificadoRequest;
import pe.edu.tecsup.sistemaacademico.dto.response.CertificadoResponse;

import java.util.List;
import java.util.UUID;

public interface CertificadoService {

    CertificadoResponse solicitar(CertificadoRequest request);

    CertificadoResponse emitir(UUID idCertificado, String urlDoc);

    List<CertificadoResponse> listarTodos();

    List<CertificadoResponse> listarPorEstudiante(UUID idEstudiante);
}