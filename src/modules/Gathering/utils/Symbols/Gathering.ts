// import { Provider } from 'src/app.module';
// import { CreateGatheringUseCase } from '../use-cases/createGathering';
// import { GetGatheringByIdUseCase } from '../use-cases/getGatheringById';
// import { GatheringRepo } from '../gathering.repo';

// export const GatheringServiceSymbol = Symbol('GatheringServiceSymbol');
export const GatheringRepoSymbol = Symbol('GatheringRepoSymbol');

export const CreateGatheringUseCaseSymbol = Symbol('CreateGatheringUseCase');
export const GetGatheringByIdUseCaseSymbol = Symbol('GetGatheringByIdUseCase');

// export const GatheringProviders = [
//   new Provider(GatheringRepoSymbol, GatheringRepo),
//   new Provider(CreateGatheringUseCaseSymbol, CreateGatheringUseCase),
//   new Provider(GetGatheringByIdUseCaseSymbol, GetGatheringByIdUseCase),
// ];
