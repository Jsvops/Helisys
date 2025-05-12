package io.bootify.helisys.mapper;

import io.bootify.helisys.domain.TransaccionesProducto;
import io.bootify.helisys.model.TransaccionesProductoDTO;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TransaccionesProductoMapper {

    @Mapping(source = "tcoPro.proId", target = "tcoPro")
    @Mapping(source = "tcoTce.tceId", target = "tcoTce")
    TransaccionesProductoDTO toDto(TransaccionesProducto entity);

    @InheritInverseConfiguration
    TransaccionesProducto toEntity(TransaccionesProductoDTO dto);
}
