package pe.edu.tecsup.sistemaacademico.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import pe.edu.tecsup.sistemaacademico.dto.response.DocumentoResponse;
import pe.edu.tecsup.sistemaacademico.model.Documento;
import pe.edu.tecsup.sistemaacademico.repository.DocumentoRepository;
import pe.edu.tecsup.sistemaacademico.service.DocumentoService;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentoServiceImpl implements DocumentoService {

    private final DocumentoRepository documentoRepository;

    @Override
    public List<DocumentoResponse> listarTodos() {
        return documentoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<DocumentoResponse> listarPorEstudiante(UUID idEstudiante) {
        return documentoRepository.findByEstudiante_IdEstudianteOrderByFechaSubidaDesc(idEstudiante)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private DocumentoResponse toResponse(Documento d) {
        return DocumentoResponse.builder()
                .idDocumento(d.getIdDocumento())
                .nombre(d.getNombre())
                .tipo(d.getTipo())
                .urlArchivo(d.getUrlArchivo())
                .fechaSubida(d.getFechaSubida())
                .codigoAlumno(d.getEstudiante().getCodigoAlumno())
                .nombreEstudiante(d.getEstudiante().getNombres() + " " + d.getEstudiante().getApellidos())
                .build();
    }
}