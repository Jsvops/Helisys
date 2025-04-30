import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ModeloAeronaveListComponent } from './modelo-aeronave/modelo-aeronave-list.component';
import { ModeloAeronaveAddComponent } from './modelo-aeronave/modelo-aeronave-add.component';
import { ModeloAeronaveEditComponent } from './modelo-aeronave/modelo-aeronave-edit.component';
import { AeronaveListComponent } from './aeronave/aeronave-list.component';
import { AeronaveAddComponent } from './aeronave/aeronave-add.component';
import { AeronaveEditComponent } from './aeronave/aeronave-edit.component';
import { AlmacenEstanteListComponent } from './almacen-estante/almacen-estante-list.component';
import { AlmacenEstanteAddComponent } from './almacen-estante/almacen-estante-add.component';
import { AlmacenEstanteEditComponent } from './almacen-estante/almacen-estante-edit.component';
import { AlmacenRepisaListComponent } from './almacen-repisa/almacen-repisa-list.component';
import { AlmacenRepisaAddComponent } from './almacen-repisa/almacen-repisa-add.component';
import { AlmacenRepisaEditComponent } from './almacen-repisa/almacen-repisa-edit.component';
import { AlmacenContenedorListComponent } from './almacen-contenedor/almacen-contenedor-list.component';
import { AlmacenContenedorAddComponent } from './almacen-contenedor/almacen-contenedor-add.component';
import { AlmacenContenedorEditComponent } from './almacen-contenedor/almacen-contenedor-edit.component';
import { ProveedorListComponent } from './proveedor/proveedor-list.component';
import { ProveedorAddComponent } from './proveedor/proveedor-add.component';
import { ProveedorEditComponent } from './proveedor/proveedor-edit.component';
import { PedidosCompraListComponent } from './pedidos-compra/pedidos-compra-list.component';
import { PedidosCompraAddComponent } from './pedidos-compra/pedidos-compra-add.component';
import { PedidosCompraEditComponent } from './pedidos-compra/pedidos-compra-edit.component';
import { TipoProductoListComponent } from './tipo-producto/tipo-producto-list.component';
import { TipoProductoAddComponent } from './tipo-producto/tipo-producto-add.component';
import { TipoProductoEditComponent } from './tipo-producto/tipo-producto-edit.component';
import { ProductoListComponent } from './producto/producto-list.component';
import { ProductoAddComponent } from './producto/producto-add.component';
import { ProductoEditComponent } from './producto/producto-edit.component';
import { PedidosProductoListComponent } from './pedidos-producto/pedidos-producto-list.component';
import { PedidosProductoAddComponent } from './pedidos-producto/pedidos-producto-add.component';
import { PedidosProductoEditComponent } from './pedidos-producto/pedidos-producto-edit.component';
import { TransaccionEventoListComponent } from './transaccion-evento/transaccion-evento-list.component';
import { TransaccionEventoAddComponent } from './transaccion-evento/transaccion-evento-add.component';
import { TransaccionEventoEditComponent } from './transaccion-evento/transaccion-evento-edit.component';
import { UsuarioListComponent } from './usuario/usuario-list.component';
import { UsuarioAddComponent } from './usuario/usuario-add.component';
import { UsuarioEditComponent } from './usuario/usuario-edit.component';
import { TransaccionListComponent } from './transaccion/transaccion-list.component';
import { TransaccionAddComponent } from './transaccion/transaccion-add.component';
import { TransaccionEditComponent } from './transaccion/transaccion-edit.component';
import { TransaccionesProductoListComponent } from './transacciones-producto/transacciones-producto-list.component';
import { TransaccionesProductoAddComponent } from './transacciones-producto/transacciones-producto-add.component';
import { TransaccionesProductoEditComponent } from './transacciones-producto/transacciones-producto-edit.component';
import { SearchComponent } from './search/search.component';
import { TransaccionCombinadaAddComponent } from './transacciones-producto/transaccion-combinada-add.component';
import { TransaccionCombinadaListComponent } from './transacciones-producto/transaccion-combinada-list.component';
import { TransaccionCombinadaEditComponent } from './transacciones-producto/transaccion-combinada-edit.component'; // Asegúrate de importar el componente
import { AlmacenCombinadoAddComponent } from './almacen-contenedor/almacen-combinado-add.component'; // Importa el nuevo componente
import { DetalleProductoModeloAeronaveAddComponent } from './detalle-producto-modelo-aeronave/detalle-producto-modelo-aeronave-add.component';
import { DetalleProductoModeloAeronaveListComponent } from './detalle-producto-modelo-aeronave/detalle-producto-modelo-aeronave-list.component';
import { DetalleProductoModeloAeronaveEditComponent } from './detalle-producto-modelo-aeronave/detalle-producto-modelo-aeronave-edit.component';
import { ProductoAeronaveAddComponent} from './detalle-producto-modelo-aeronave/producto-aeronave-add.component';
import { ProductoAeronaveListComponent } from './detalle-producto-modelo-aeronave/producto-aeronave-list.component';
import { ProductoAeronaveEditComponent } from './detalle-producto-modelo-aeronave/producto-aeronave-edit.component';
import { ErrorComponent } from './error/error.component';


export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    title: $localize`:@@home.index.headline:Welcome to your new app!`
  },
  {
    path: 'modeloAeronaves',
    component: ModeloAeronaveListComponent,
    title: $localize`:@@modeloAeronave.list.headline:Modelo Aeronaves`
  },
  {
    path: 'modeloAeronaves/add',
    component: ModeloAeronaveAddComponent,
    title: $localize`:@@modeloAeronave.add.headline:Add Modelo Aeronave`
  },
  {
    path: 'modeloAeronaves/edit/:mreId',
    component: ModeloAeronaveEditComponent,
    title: $localize`:@@modeloAeronave.edit.headline:Edit Modelo Aeronave`
  },
  {
    path: 'aeronaves',
    component: AeronaveListComponent,
    title: $localize`:@@aeronave.list.headline:Aeronaves`
  },
  {
    path: 'aeronaves/add',
    component: AeronaveAddComponent,
    title: $localize`:@@aeronave.add.headline:Add Aeronave`
  },
  {
    path: 'aeronaves/edit/:anvId',
    component: AeronaveEditComponent,
    title: $localize`:@@aeronave.edit.headline:Edit Aeronave`
  },
  {
    path: 'almacenEstantes',
    component: AlmacenEstanteListComponent,
    title: $localize`:@@almacenEstante.list.headline:Almacen Estantes`
  },
  {
    path: 'almacenEstantes/add',
    component: AlmacenEstanteAddComponent,
    title: $localize`:@@almacenEstante.add.headline:Add Almacen Estante`
  },
  {
    path: 'almacenEstantes/edit/:amtId',
    component: AlmacenEstanteEditComponent,
    title: $localize`:@@almacenEstante.edit.headline:Edit Almacen Estante`
  },
  {
    path: 'almacenRepisas',
    component: AlmacenRepisaListComponent,
    title: $localize`:@@almacenRepisa.list.headline:Almacen Repisas`
  },
  {
    path: 'almacenRepisas/add',
    component: AlmacenRepisaAddComponent,
    title: $localize`:@@almacenRepisa.add.headline:Add Almacen Repisa`
  },
  {
    path: 'almacenRepisas/edit/:amrId',
    component: AlmacenRepisaEditComponent,
    title: $localize`:@@almacenRepisa.edit.headline:Edit Almacen Repisa`
  },
  {
    path: 'almacenContenedores',
    component: AlmacenContenedorListComponent,
    title: $localize`:@@almacenContenedor.list.headline:Almacen Contenedores`
  },
  {
    path: 'almacenContenedores/add',
    component: AlmacenContenedorAddComponent,
    title: $localize`:@@almacenContenedor.add.headline:Add Almacen Contenedor`
  },
  {
    path: 'almacenContenedores/edit/:amcId',
    component: AlmacenContenedorEditComponent,
    title: $localize`:@@almacenContenedor.edit.headline:Edit Almacen Contenedor`
  },
  {
    path: 'proveedores',
    component: ProveedorListComponent,
    title: $localize`:@@proveedor.list.headline:Proveedores`
  },
  {
    path: 'proveedores/add',
    component: ProveedorAddComponent,
    title: $localize`:@@proveedor.add.headline:Add Proveedor`
  },
  {
    path: 'proveedores/edit/:pveId',
    component: ProveedorEditComponent,
    title: $localize`:@@proveedor.edit.headline:Edit Proveedor`
  },
  {
    path: 'pedidosCompras',
    component: PedidosCompraListComponent,
    title: $localize`:@@pedidosCompra.list.headline:Pedidos Compras`
  },
  {
    path: 'pedidosCompras/add',
    component: PedidosCompraAddComponent,
    title: $localize`:@@pedidosCompra.add.headline:Add Pedidos Compra`
  },
  {
    path: 'pedidosCompras/edit/:pcaId',
    component: PedidosCompraEditComponent,
    title: $localize`:@@pedidosCompra.edit.headline:Edit Pedidos Compra`
  },
  {
    path: 'tipoProductos',
    component: TipoProductoListComponent,
    title: $localize`:@@tipoProducto.list.headline:Tipo Productos`
  },
  {
    path: 'tipoProductos/add',
    component: TipoProductoAddComponent,
    title: $localize`:@@tipoProducto.add.headline:Add Tipo Producto`
  },
  {
    path: 'tipoProductos/edit/:tpoId',
    component: TipoProductoEditComponent,
    title: $localize`:@@tipoProducto.edit.headline:Edit Tipo Producto`
  },
  {
    path: 'productos',
    component: ProductoListComponent,
    title: $localize`:@@producto.list.headline:Productos`
  },
  {
    path: 'productos/add',
    component: ProductoAddComponent,
    title: $localize`:@@producto.add.headline:Add Producto`
  },
  {
    path: 'productos/edit/:proId',
    component: ProductoEditComponent,
    title: $localize`:@@producto.edit.headline:Edit Producto`
  },
  {
    path: 'pedidosProductos',
    component: PedidosProductoListComponent,
    title: $localize`:@@pedidosProducto.list.headline:Pedidos Productos`
  },
  {
    path: 'pedidosProductos/add',
    component: PedidosProductoAddComponent,
    title: $localize`:@@pedidosProducto.add.headline:Add Pedidos Producto`
  },
  {
    path: 'pedidosProductos/edit/:pptId',
    component: PedidosProductoEditComponent,
    title: $localize`:@@pedidosProducto.edit.headline:Edit Pedidos Producto`
  },
  {
    path: 'transaccionEventos',
    component: TransaccionEventoListComponent,
    title: $localize`:@@transaccionEvento.list.headline:Transaccion Eventos`
  },
  {
    path: 'transaccionEventos/add',
    component: TransaccionEventoAddComponent,
    title: $localize`:@@transaccionEvento.add.headline:Add Transaccion Evento`
  },
  {
    path: 'transaccionEventos/edit/:tvoId',
    component: TransaccionEventoEditComponent,
    title: $localize`:@@transaccionEvento.edit.headline:Edit Transaccion Evento`
  },
  {
    path: 'usuarios',
    component: UsuarioListComponent,
    title: $localize`:@@usuario.list.headline:Usuarios`
  },
  {
    path: 'usuarios/add',
    component: UsuarioAddComponent,
    title: $localize`:@@usuario.add.headline:Add Usuario`
  },
  {
    path: 'usuarios/edit/:usrId',
    component: UsuarioEditComponent,
    title: $localize`:@@usuario.edit.headline:Edit Usuario`
  },
  {
    path: 'transacciones',
    component: TransaccionListComponent,
    title: $localize`:@@transaccion.list.headline:Transacciones`
  },
  {
    path: 'transacciones/add',
    component: TransaccionAddComponent,
    title: $localize`:@@transaccion.add.headline:Add Transaccion`
  },
  {
    path: 'transacciones/edit/:tceId',
    component: TransaccionEditComponent,
    title: $localize`:@@transaccion.edit.headline:Edit Transaccion`
  },
  {
    path: 'transaccionesProductos',
    component: TransaccionesProductoListComponent,
    title: $localize`:@@transaccionesProducto.list.headline:Transacciones Productos`
  },
  {
    path: 'transaccionesProductos/add',
    component: TransaccionesProductoAddComponent,
    title: $localize`:@@transaccionesProducto.add.headline:Add Transacciones Producto`
  },
  {
    path: 'transaccionesProductos/edit/:tcoId',
    component: TransaccionesProductoEditComponent,
    title: $localize`:@@transaccionesProducto.edit.headline:Edit Transacciones Producto`
  },
  {
    path: 'search',
    component: SearchComponent,
    title: `SearchProducts`
  },
  {
    path: 'transaccion-combinada-add',
    component: TransaccionCombinadaAddComponent,
    title: $localize`:@@transaccionCombinada.add.headline:Add Transacción Combinada`
  },
  {
    path: 'transaccion-combinada-list',
    component: TransaccionCombinadaListComponent,
    title: $localize`:@@transaccionCombinada.list.headline:Lista de Transacciones Combinadas`
  },
  {
    path: 'transaccion-combinada-edit/:tceId/:tcoId',
    component: TransaccionCombinadaEditComponent,
    title: $localize`:@@transaccionCombinada.edit.headline:Edit Transacción Combinada`
  },
  {
    path: 'almacen-combinado-add', // Nueva ruta para AlmacenCombinadoAddComponent
    component: AlmacenCombinadoAddComponent,
    title: $localize`:@@almacenCombinado.add.headline:Add Almacen Combinado`
  },
  {
      path: 'detalle-producto-modelo-aeronave-add', // Ruta en la URL
      component: DetalleProductoModeloAeronaveAddComponent, // Componente asociado
      title: $localize`:@@detalleProductoModeloAeronave.add.headline:Agregar Detalle Producto Modelo Aeronave` // Título localizado
  },
  {
      path: 'detalle-producto-modelo-aeronave-list', // Ruta para la lista de detalles
      component: DetalleProductoModeloAeronaveListComponent,
      title: $localize`:@@detalle.list.headline:Lista de Detalles de Producto Modelo Aeronave`
  },
  {
     path: 'detalle-producto-modelo-aeronave-edit/:dpmaId', // Ruta para editar
     component: DetalleProductoModeloAeronaveEditComponent,
     title: $localize`:@@detalle.edit.headline:Editar Detalle de Producto Modelo Aeronave`
  },
  {
    path: 'producto-aeronave-add', // Ruta para editar
         component: ProductoAeronaveAddComponent,
         title: $localize`:@@productoAeronave.add.headline:Agregar Producto, Modelo Aeronave y Detalle`
  },
  {
    path: 'producto-aeronave-edit/:proId/:dpmaId', // Ruta para editar (con parámetros)
    component: ProductoAeronaveEditComponent,
    title: $localize`:@@productoAeronave.edit.headline:Editar Producto y Modelos Aeronave`
  },
  {
      path: 'producto-aeronave-list', // Ruta para editar (con parámetros)
      component: ProductoAeronaveListComponent,
      title: $localize`@@productoAeronave.list.headline:Relaciones Producto-Modelo Aeronave`
  },
  {
    path: 'error',
    component: ErrorComponent,
    title: $localize`:@@error.headline:Error`
  },
  {
    path: '**',
    component: ErrorComponent,
    title: $localize`:@@notFound.headline:Page not found`
  }
];
