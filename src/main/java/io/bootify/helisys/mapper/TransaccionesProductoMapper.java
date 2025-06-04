package io.bootify.helisys.mapper;

import io.bootify.helisys.domain.TransaccionesProducto;
import io.bootify.helisys.model.TransaccionesProductoDTO;
import org.mapstruct.InheritInverseConfiguration;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;


@Mapper(componentModel = "spring")
public interface TransaccionesProductoMapper {

    @InheritInverseConfiguration
    @Mapping(target = "ltpdTcos", ignore = true)
    TransaccionesProducto toEntity(TransaccionesProductoDTO dto);

    @Mapping(source = "tcoPro.proId", target = "tcoPro")
    @Mapping(source = "tcoTce.tceId", target = "tcoTce")
   TransaccionesProductoDTO toDto(TransaccionesProducto entity);
}
